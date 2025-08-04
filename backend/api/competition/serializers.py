from rest_framework.serializers import ModelSerializer
from apps.competition.models import Competition, Book, CompetitionRegistration, StudentComment
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
class CompetitionSerializer(ModelSerializer):
    class Meta:
        model = Competition
        fields = ['id','title','description','created_by','start_date','end_date']
        extra_kwargs = {
            "created_by": {"required": False},
        }

    def create(self, validated_data):
        user = self.context['request'].user
        competition = Competition.objects.create(created_by=user,**validated_data)
        return competition


class BookSerializer(ModelSerializer):
    class Meta:
        model = Book
        fields = ['id','competition','title','file']

class CompetitionRegistrationSerializer(ModelSerializer):

    def create(self, validated_data):
        user = self.context['request'].user
        try:
            return CompetitionRegistration.objects.create(
                student=user,
                **validated_data
            )
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

