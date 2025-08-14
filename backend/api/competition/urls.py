from rest_framework import routers

from api.competition.viewsets import (CompetitionStudentViewSet,
                                      CompetitionViewSet,
                                      CompetitionRegistrationViewSet,
                                      MyCommentViewSet,
                                        CompetitionTeacherViewSet,
                                      StudentCommentViewSet,
                                      DailyPageViewSet,
                                    BookRatingViewSet,
                                      )

router = routers.DefaultRouter()

router.register('competitions', CompetitionViewSet,basename='competition')
router.register('competition/register', CompetitionRegistrationViewSet,basename='book')
router.register('students', CompetitionStudentViewSet,basename='student')
router.register('competitions-student', CompetitionStudentViewSet,basename='registration')
router.register('student-comments',StudentCommentViewSet,basename='student-comment')
router.register(r'my-comments', MyCommentViewSet,basename='my-comment')
router.register('teacher',CompetitionTeacherViewSet,basename='teacher')
router.register('book-rating',BookRatingViewSet,basename='book-rating')
router.register(r'daily-page',DailyPageViewSet,basename='daily-page')
urlpatterns = router.urls