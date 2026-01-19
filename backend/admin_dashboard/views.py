from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from accounts.models import User
from products.models import Product
from orders.models import Order
from django.db.models import Sum, Count
from datetime import timedelta
from django.utils import timezone

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

        return Response({
            "total_users": total_users,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "recent_orders_7d": recent_orders_count,
            "low_stock_products": low_stock_products
        })
