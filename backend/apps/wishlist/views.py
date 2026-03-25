from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer, WishlistItemSerializer
from orders.models import Cart, CartItem


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
    
    def get_object(self):
        wishlist, created = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        
        wishlist_item, created = WishlistItem.objects.get_or_create(
            wishlist=wishlist,
            product_id=product_id
        )
        
        if created:
            return Response(WishlistItemSerializer(wishlist_item).data, status=status.HTTP_201_CREATED)
        return Response({'message': 'Item already in wishlist'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        wishlist = Wishlist.objects.get(user=request.user)
        item_id = request.data.get('item_id')
        
        try:
            wishlist_item = WishlistItem.objects.get(id=item_id, wishlist=wishlist)
            wishlist_item.delete()
            return Response({'message': 'Item removed'}, status=status.HTTP_200_OK)
        except WishlistItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def move_to_cart(self, request):
        wishlist = Wishlist.objects.get(user=request.user)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item_id = request.data.get('item_id')
        
        try:
            wishlist_item = WishlistItem.objects.get(id=item_id, wishlist=wishlist)
            
            # Add to cart
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=wishlist_item.product,
                defaults={'quantity': 1}
            )
            
            if not created:
                cart_item.quantity += 1
                cart_item.save()
            
            # Remove from wishlist
            wishlist_item.delete()
            
            return Response({'message': 'Item moved to cart'}, status=status.HTTP_200_OK)
        except WishlistItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
