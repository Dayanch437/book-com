from django.urls import path
from .viewsets import RegisterView, VerifyEmailView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('verify-email/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify-email'),]