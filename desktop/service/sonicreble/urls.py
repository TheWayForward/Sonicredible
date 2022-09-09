from django.urls import path
from . import views

urlpatterns = [
    path('voiceprint_contrast', views.voiceprint_contrast, name='voiceprint_contrast')
]
