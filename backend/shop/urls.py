from django.urls import path
from . import views

urlpatterns = [
    path('ping/', views.ping),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
]