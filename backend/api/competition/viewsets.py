from poetry.console.commands import self
from rest_framework import viewsets
from apps.competition.models import Competition, Book, CompetitionRegistration, StudentComment
from .serializers import CompetitionSerializer, BookSerializer, CompetitionRegistrationSerializer, \
    StudentCommentSerializer,CompetitionTeacherSerializer
from apps.utils.permissions import IsTeacherOrAdmin

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