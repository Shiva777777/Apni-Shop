from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags


def send_email(subject, template_name, context, recipient_list):
    """
    Send email using template
    """
    try:
        html_message = render_to_string(f'emails/{template_name}.html', context)
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Email sending failed: {str(e)}")
        return False


def send_welcome_email(user):
    """Send welcome email to new user"""
    context = {
        'user': user,
        'site_name': 'Apni Shop',
    }
    return send_email(
        subject='Welcome to Apni Shop!',
        template_name='welcome',
        context=context,
        recipient_list=[user.email]
    )


def send_email_verification(user, token):
    """Send email verification link"""
    verification_url = f"{settings.FRONTEND_URL}/verify-email/{token}"
    context = {
        'user': user,
        'verification_url': verification_url,
        'site_name': 'Apni Shop',
    }
    return send_email(
        subject='Verify Your Email - Apni Shop',
        template_name='email_verification',
        context=context,
        recipient_list=[user.email]
    )


def send_password_reset_email(user, token):
    """Send password reset link"""
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}"
    context = {
        'user': user,
        'reset_url': reset_url,
        'site_name': 'Apni Shop',
    }
    return send_email(
        subject='Reset Your Password - Apni Shop',
        template_name='password_reset',
        context=context,
        recipient_list=[user.email]
    )


def send_order_confirmation_email(order):
    """Send order confirmation email"""
    context = {
        'order': order,
        'user': order.user,
        'site_name': 'Apni Shop',
        'order_url': f"{settings.FRONTEND_URL}/orders/{order.order_number}",
    }
    return send_email(
        subject=f'Order Confirmation - {order.order_number}',
        template_name='order_confirmation',
        context=context,
        recipient_list=[order.user.email]
    )


def send_order_shipped_email(order):
    """Send order shipped notification"""
    context = {
        'order': order,
        'user': order.user,
        'site_name': 'Apni Shop',
        'tracking_url': f"{settings.FRONTEND_URL}/orders/{order.order_number}/track",
    }
    return send_email(
        subject=f'Your Order Has Been Shipped - {order.order_number}',
        template_name='order_shipped',
        context=context,
        recipient_list=[order.user.email]
    )


def send_order_delivered_email(order):
    """Send order delivered notification"""
    context = {
        'order': order,
        'user': order.user,
        'site_name': 'Apni Shop',
    }
    return send_email(
        subject=f'Your Order Has Been Delivered - {order.order_number}',
        template_name='order_delivered',
        context=context,
        recipient_list=[order.user.email]
    )
