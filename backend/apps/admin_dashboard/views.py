from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from accounts.models import User
from products.models import Product, Category, SubCategory, ProductImage
from products.serializers import CategorySerializer, SubCategorySerializer
from orders.models import Order
from django.db.models import Sum, Count
from datetime import timedelta
from django.utils import timezone


class IsAdminUser(permissions.BasePermission):
    """Custom permission to only allow admin users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin


class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({"error": "Admin access required"}, status=403)

        total_users = User.objects.count()
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        total_revenue = Order.objects.aggregate(Sum('total_amount'))['total_amount__sum'] or 0

        # Recent orders
        recent_orders_count = Order.objects.filter(created_at__gte=timezone.now() - timedelta(days=7)).count()
        
        # Low stock products
        low_stock_products = Product.objects.filter(stock__lt=10).count()
        
        # Category stats
        total_categories = Category.objects.count()
        total_subcategories = SubCategory.objects.count()

        return Response({
            "total_users": total_users,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "recent_orders_7d": recent_orders_count,
            "low_stock_products": low_stock_products,
            "total_categories": total_categories,
            "total_subcategories": total_subcategories
        })


# ==================== CATEGORY MANAGEMENT ====================

class AdminCategoryListCreateView(APIView):
    """List all categories and create new category"""
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        categories = Category.objects.all().order_by('name')
        serializer = CategorySerializer(categories, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminCategoryDetailView(APIView):
    """Get, update or delete a category"""
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return None

    def get(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        # Check if category has products
        if category.products.exists():
            return Response(
                {"error": "Cannot delete category with associated products"},
                status=status.HTTP_400_BAD_REQUEST
            )
        category.delete()
        return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# ==================== SUBCATEGORY MANAGEMENT ====================

class AdminSubCategoryListCreateView(APIView):
    """List all subcategories and create new subcategory"""
    permission_classes = [IsAdminUser]

    def get(self, request):
        category_id = request.query_params.get('category')
        subcategories = SubCategory.objects.all().select_related('category').order_by('category__name', 'name')
        if category_id:
            subcategories = subcategories.filter(category_id=category_id)
        serializer = SubCategorySerializer(subcategories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SubCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminSubCategoryDetailView(APIView):
    """Get, update or delete a subcategory"""
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return SubCategory.objects.get(pk=pk)
        except SubCategory.DoesNotExist:
            return None

    def get(self, request, pk):
        subcategory = self.get_object(pk)
        if not subcategory:
            return Response({"error": "SubCategory not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = SubCategorySerializer(subcategory)
        return Response(serializer.data)

    def put(self, request, pk):
        subcategory = self.get_object(pk)
        if not subcategory:
            return Response({"error": "SubCategory not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = SubCategorySerializer(subcategory, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        subcategory = self.get_object(pk)
        if not subcategory:
            return Response({"error": "SubCategory not found"}, status=status.HTTP_404_NOT_FOUND)
        # Check if subcategory has products
        if subcategory.products.exists():
            return Response(
                {"error": "Cannot delete subcategory with associated products"},
                status=status.HTTP_400_BAD_REQUEST
            )
        subcategory.delete()
        return Response({"message": "SubCategory deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
