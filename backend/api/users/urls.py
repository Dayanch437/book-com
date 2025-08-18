from django.urls import path
from rest_framework.routers import DefaultRouter

from .viewsets import (
    DepartmentViewSet,
    FacultyViewSet,
    RequestOTPResetView,
    ResetPasswordWithOTPView,
    UserViewSet,
)

router = DefaultRouter()
router.register("users", UserViewSet)
router.register("departments", DepartmentViewSet)
router.register("faculty", FacultyViewSet)

urlpatterns = [
    path("otp/request-reset/", RequestOTPResetView.as_view()),
    path("otp/reset-password/", ResetPasswordWithOTPView.as_view()),
] + router.urls
