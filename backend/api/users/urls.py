from django.urls import path

from .viewsets import ( RequestOTPResetView,
                       ResetPasswordWithOTPView)

urlpatterns = [
    path("otp/request-reset/", RequestOTPResetView.as_view()),
    path("otp/reset-password/", ResetPasswordWithOTPView.as_view()),
]
