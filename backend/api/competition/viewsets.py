from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.competition.models import Competition, Book, CompetitionRegistration, StudentComment, DailyPages, BookRating, \
    Achievement, Notification
from .serializers import CompetitionSerializer, BookSerializer, CompetitionRegistrationSerializer, \
    StudentCommentSerializer, CompetitionTeacherSerializer, DailyPageSerializer, BookRatingSerializer, \
    AchievementSerializer, NotificationSerializer, InboxSerializer
from apps.utils.permissions import IsTeacherOrAdmin
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError

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
    http_method_names = ['get']



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
    queryset = StudentComment.objects.all()
    serializer_class = StudentCommentSerializer

    def get_queryset(self):
        user = self.request.user
        return StudentComment.objects.filter(student=user)

class CompetitionTeacherViewSet(viewsets.ModelViewSet):

    queryset = CompetitionRegistration.objects.all()
    serializer_class =  CompetitionTeacherSerializer
    http_method_names = ['get']

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


class BookRatingViewSet(viewsets.ModelViewSet):
    queryset = BookRating.objects.all()
    serializer_class = BookRatingSerializer

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

    queryset = CompetitionRegistration.objects.all()
    serializer_class = InboxSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(student=self.request.user)
        return qs
