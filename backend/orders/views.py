from decimal import Decimal
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Cart, CartItem, Address, Coupon, Order, OrderItem
from .serializers import (
    CartSerializer, CartItemSerializer, AddressSerializer,
    CouponSerializer, OrderSerializer, OrderCreateSerializer
)
from accounts.permissions import IsAdmin
from utils.email import send_order_confirmation_email


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_id=product_id,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()
        
        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def update_item(self, request):
        cart = Cart.objects.get(user=request.user)
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.quantity = quantity
            cart_item.save()
            return Response(CartItemSerializer(cart_item).data)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = Cart.objects.get(user=request.user)
        item_id = request.data.get('item_id')
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.delete()
            return Response({'message': 'Item removed'}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['post'])
    def validate_coupon(self, request):
        code = request.data.get('code')
        order_amount = request.data.get('order_amount', 0)
        
        try:
            coupon = Coupon.objects.get(code=code)
            if not coupon.is_valid:
                return Response({'error': 'Coupon is not valid'}, status=status.HTTP_400_BAD_REQUEST)
            
            discount = coupon.calculate_discount(Decimal(str(order_amount)))
            return Response({
                'valid': True,
                'discount': discount,
                'coupon': CouponSerializer(coupon).data
            })
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon code'}, status=status.HTTP_404_NOT_FOUND)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_admin:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
    @transaction.atomic
    def create(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Get cart
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get address
        try:
            address = Address.objects.get(id=serializer.validated_data['shipping_address_id'], user=request.user)
        except Address.DoesNotExist:
            return Response({'error': 'Invalid address'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate totals
        subtotal = cart.subtotal
        discount_amount = Decimal('0')
        coupon = None
        
        # Apply coupon if provided
        coupon_code = serializer.validated_data.get('coupon_code')
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code)
                if coupon.is_valid:
                    discount_amount = coupon.calculate_discount(subtotal)
            except Coupon.DoesNotExist:
                pass
        
        shipping_charge = Decimal('0') if subtotal > Decimal('500') else Decimal('50')
        tax_amount = (subtotal - discount_amount) * Decimal('0.18')  # 18% tax
        total_amount = subtotal - discount_amount + shipping_charge + tax_amount
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            subtotal=subtotal,
            discount_amount=discount_amount,
            shipping_charge=shipping_charge,
            tax_amount=tax_amount,
            total_amount=total_amount,
            shipping_address=address,
            coupon=coupon,
            payment_method=serializer.validated_data['payment_method'],
            customer_notes=serializer.validated_data.get('customer_notes', '')
        )
        
        # Create order items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.name,
                product_price=cart_item.product.discounted_price,
                quantity=cart_item.quantity,
                total_price=cart_item.total_price
            )
            
            # Update product stock
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save()
        
        # Update coupon usage
        if coupon:
            coupon.used_count += 1
            coupon.save()
        
        # Clear cart
        cart.items.all().delete()
        
        # Send confirmation email
        send_order_confirmation_email(order)
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(Order.OrderStatus.choices):
            order.status = new_status
            order.save()
            
            # Send email notifications based on status
            if new_status == Order.OrderStatus.SHIPPED:
                from utils.email import send_order_shipped_email
                send_order_shipped_email(order)
            elif new_status == Order.OrderStatus.DELIVERED:
                from utils.email import send_order_delivered_email
                send_order_delivered_email(order)
            
            return Response(OrderSerializer(order).data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
