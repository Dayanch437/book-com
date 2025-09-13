import random

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.shortcuts import render
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.views import View
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from apps.users.models import Department, Faculty, PasswordResetOTP, User

from .serializers import (
    DepartmentSerializer,
    FacultySerializer,
    RequestOTPSerializer,
    ResetPasswordWithOTPSerializer,
    UserRegisterSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save(is_active=True)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        activation_link = f"{self.request.scheme}://{self.request.get_host()}/api/verify-email/{uid}/{token}/"
        send_mail(
            subject="Verify your email",
            message=f"Click this link to verify your account: {activation_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
        return user

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"status": "ok", "message": "Verification link sent to your email."},
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(View):
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            user = None

        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return render(request, "email_verified.html")

        return render(request, "email_invalid.html")


class RequestOTPResetView(APIView):
    @extend_schema(
        request=RequestOTPSerializer,
        responses={200: OpenApiResponse(description="OTP sent")},
    )
    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        if not email:
            return Response({"detail": "Email is required."}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "If email exists, OTP sent."}, status=200)

        otp = f"{random.randint(100000, 999999)}"
        PasswordResetOTP.objects.create(user=user, otp=otp)

        send_mail(
            subject="Your Password Reset OTP",
            message=f"Use this code to reset your password: {otp}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        return Response({"detail": "OTP sent to email."}, status=200)


class ResetPasswordWithOTPView(APIView):
    @extend_schema(
        request=ResetPasswordWithOTPSerializer,
        responses={200: OpenApiResponse(description="Password reset successful")},
    )
    def post(self, request):
        serializer = ResetPasswordWithOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]
        new_password = serializer.validated_data["new_password"]

        if not all([email, otp, new_password]):
            return Response({"detail": "All fields are required."}, status=400)

        try:
            user = User.objects.get(email=email)
            otp_record = PasswordResetOTP.objects.filter(user=user, otp=otp).latest(
                "created_at"
            )
        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({"detail": "Invalid OTP or email."}, status=400)

        if otp_record.is_expired():
            return Response({"detail": "OTP expired."}, status=400)

        user.set_password(new_password)
        user.save()
        otp_record.delete()  # optional: cleanup

        return Response({"detail": "Password reset successful."}, status=200)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        qs = qs.filter(id=user.id)
        return qs


class DepartmentViewSet(ModelViewSet):

    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    http_method_names = ["get"]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["name", "faculty"]


class FacultyViewSet(ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    http_method_names = ["get"]


from rest_framework import status

# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_token(request):
    token = request.data.get("token", None)

    if not token:
        return Response(
            {"detail": "Token not provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # This will raise an exception if token is invalid
        AccessToken(token)
        return Response({"detail": "Token is valid"}, status=status.HTTP_200_OK)
    except TokenError as e:
        return Response(
            {"detail": "Token is invalid or expired"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
