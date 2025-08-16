from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from api.users.serializers import UserSerializer
from apps.competition.models import Competition, \
    Book, CompetitionRegistration, StudentComment, \
    DailyPages, BookRating, \
    Achievement, Notification
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from rest_framework import serializers

class BookSerializer(ModelSerializer):
    class Meta:
        model = Book
        fields = ['id','competition','title','file']

class NotificationSerializer(ModelSerializer):


    class Meta:
        model = Notification
        fields = ['get_user_full_name','text']

    def create(self, validated_data):
        user = self.context['request'].user
        return Notification.objects.create(user=user,**validated_data)

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
    notifications = NotificationSerializer(many=True, read_only=True)
    class Meta:
        model = CompetitionRegistration
        fields = ['id', 'student', 'competition', 'student_cart','group_number','notifications']
        extra_kwargs = {
            "student": {"required": False, "read_only": True},
        }

class StudentCommentSerializer(ModelSerializer):
    def create(self, validated_data):
        user = self.context['request'].user
        competition = validated_data.pop('competition')  # get competition instance
        type = validated_data.pop('type')
        text = validated_data.pop('text')

        return StudentComment.objects.create(
            student=user,
            competition=competition,
            text=text,
            type=type,
        )

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if instance.student != user:
            raise ValidationError('You cannot update a student comment')
        else:
            instance.delete()
            competition = validated_data.pop('competition')
            user = self.context['request'].user
            text = validated_data.pop('text')
            type = validated_data.pop('type')
            return StudentComment.objects.create(
                student=user,
                competition=competition,
                text=text,
                type=type,
            )

    class Meta:
        model = StudentComment
        fields = ['id','type','competition', 'student', 'text','created_at']
        extra_kwargs = {
            "student": {"required": False},
        }

class CompetitionTeacherSerializer(ModelSerializer):

    class Meta:
        model = CompetitionRegistration
        fields = ["id","student","student_cart",'group_number']

class DailyPageSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = DailyPages
        fields = ['id','competition','user','book','page']


    def create(self, validated_data):
        user = self.context['request'].user
        competition = validated_data.pop('competition')
        book = validated_data.pop('book')
        page = validated_data.pop('page')
        return DailyPages.objects.create(
            user=user,
            competition=competition,
            book=book,
            page=page,
        )

class BookRatingSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = BookRating
        fields = ['id','competition','book','user','rating']

    def create(self, validated_data):
        user = self.context['request'].user
        competition = validated_data.pop('competition')
        book = validated_data.pop('book')
        rating = validated_data.pop('rating')
        # Delete the old rating if exists

        # BookRating.objects.filter(
        #     user=user,
        #     competition=competition,
        #     book=book
        # ).delete()

        return BookRating.objects.create(
            user=user,
            competition=competition,
            book=book,
            rating=rating,
        )

class AchievementSerializer(ModelSerializer):

    class Meta:
        model = Achievement
        fields = ['id','user','name']




class InboxSerializer(ModelSerializer):
    notifications = NotificationSerializer(many=True, read_only=True)

    class Meta:
        model = CompetitionRegistration
        fields = ['id','notifications']
