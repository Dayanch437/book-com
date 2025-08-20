from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.permissions import IsAuthenticated

from apps.competition.models import (
    Achievement,
    Book,
    BookRating,
    Competition,
    CompetitionRegistration,
    DailyPages,
    Notification,
    StudentComment,
)
from apps.users.models import User
from apps.utils.permissions import IsTeacherOrAdmin

from .serializers import (
    AchievementSerializer,
    BookRatingSerializer,
    BookSerializer,
    CompetitionRegistrationSerializer,
    CompetitionSerializer,
    CompetitionTeacherSerializer,
    DailyPageSerializer,
    InboxSerializer,
    NotificationSerializer,
    StudentCommentSerializer,
    CommentsSerializer
)


class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(created_by=self.request.user)
        return qs


class CompetitionStudentViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    http_method_names = ["get"]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsTeacherOrAdmin]


class CompetitionRegistrationViewSet(viewsets.ModelViewSet):
    queryset = CompetitionRegistration.objects.all()
    serializer_class = CompetitionRegistrationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(student=self.request.user)
        return qs


class StudentCommentViewSet(viewsets.ModelViewSet):
    queryset = StudentComment.objects.all()
    serializer_class = StudentCommentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(student=self.request.user)
        return qs


class MyCommentViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CommentsSerializer

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(comments__competition__created_by=user)


class CompetitionTeacherViewSet(viewsets.ModelViewSet):

    queryset = CompetitionRegistration.objects.all()
    serializer_class = CompetitionTeacherSerializer
    http_method_names = ["get"]

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(competition__created_by=self.request.user)
        return qs


class DailyPageViewSet(viewsets.ModelViewSet):
    queryset = DailyPages.objects.all()
    serializer_class = DailyPageSerializer

    def perform_create(self, serializer):
        try:
            serializer.save()
        except DjangoValidationError as e:
            raise DRFValidationError(e.messages)

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user=self.request.user)


class BookRatingViewSet(viewsets.ModelViewSet):
    queryset = BookRating.objects.all()
    serializer_class = BookRatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(user=self.request.user)
        return qs


class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(user=self.request.user)
        return qs


class NotificationViewSet(viewsets.ModelViewSet):

    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]


class NotificationCompetitionViewSet(viewsets.ModelViewSet):

    queryset = Competition.objects.all()
    serializer_class = InboxSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get"]

