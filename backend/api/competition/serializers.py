from rest_framework.serializers import ModelSerializer
from apps.competition.models import Competition, Book, CompetitionRegistration, StudentComment
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from rest_framework import serializers
class BookSerializer(ModelSerializer):
    class Meta:
        model = Book
        fields = ['id','competition','title','file']

class CompetitionSerializer(ModelSerializer):
    books = BookSerializer(many=True, read_only=True)
    full_name = serializers.SerializerMethodField()
    is_registered = serializers.SerializerMethodField()

    class Meta:
        model = Competition
        fields = [
            'id', 'title', 'books', 'description',
            'created_by', 'full_name', 'start_date', 'end_date',
            'is_registered'
        ]
        extra_kwargs = {
            "created_by": {"required": False},
        }

    def get_is_registered(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return CompetitionRegistration.objects.filter(
                student=request.user,
                competition=obj
            ).exists()
        return False

    def create(self, validated_data):
        user = self.context['request'].user
        competition = Competition.objects.create(created_by=user, **validated_data)
        return competition

    def get_full_name(self, obj):
        return f"{obj.created_by.first_name} {obj.created_by.last_name}"



class CompetitionRegistrationSerializer(ModelSerializer):

    def create(self, validated_data):
        user = self.context['request'].user
        try:
            competition_register = CompetitionRegistration.objects.create(
                student=user,
                **validated_data
            )
            return competition_register
        except IntegrityError:
            raise ValidationError({"detail": "You have already registered for this competition."})

    class Meta:
        model = CompetitionRegistration
        fields = ['id', 'student', 'competition', 'student_cart']
        extra_kwargs = {
            "student": {"required": False, "read_only": True},
        }

class StudentCommentSerializer(ModelSerializer):
    def create(self, validated_data):
        user = self.context['request'].user
        competition = validated_data.pop('competition')  # get competition instance
        comment = validated_data.pop('comment')          # get comment text

        return StudentComment.objects.create(
            student=user,
            competition=competition,
            comment=comment
        )

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if instance.student != user:
            raise ValidationError('You cannot update a student comment')
        else:
            instance.delete()
            competition = validated_data.pop('competition')
            user = self.context['request'].user
            comment = validated_data.pop('comment')
            return StudentComment.objects.create(
                student=user,
                competition=competition,
                comment=comment
            )

    class Meta:
        model = StudentComment
        fields = ['id', 'competition', 'student', 'comment']
        extra_kwargs = {
            "student": {"required": False},
        }

class CompetitionTeacherSerializer(ModelSerializer):

    class Meta:
        model = CompetitionRegistration
        fields = ["id","student","name","surname","student_cart"]