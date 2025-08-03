from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView
from  api.users.serializers import CustomTokenObtainPairSerializer
from api.users.viewsets import (
    RegisterView,
    VerifyEmailView
)

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path('auth/login/', TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer)),
    path('verify-email/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify-email'),
]
