from rest_framework import routers

from api.competition.viewsets import (CompetitionStudentViewSet,
                                      CompetitionViewSet,
                                      CompetitionRegistrationViewSet,
                                      MyCommentViewSet,
                                      StudentCommentViewSet
                                      )

router = routers.DefaultRouter()

router.register('competitions', CompetitionViewSet,basename='competition')
router.register('competition/register', CompetitionRegistrationViewSet,basename='book')
router.register('students', CompetitionStudentViewSet,basename='student')
router.register('competitions-student', CompetitionStudentViewSet,basename='registration')
router.register('student-comments',StudentCommentViewSet,basename='student-comment')
router.register(r'my-comments', MyCommentViewSet,basename='my-comment')

urlpatterns = router.urls