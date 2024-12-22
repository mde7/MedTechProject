"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.http import JsonResponse
from django.contrib import admin
from django.urls import path
from api.views import AnalysisResultView, VariantDetectionView, SequenceAlignmentView, ORFDetectionView


urlpatterns = [
    path('', lambda request: JsonResponse({"status": "ok"}), name='health-check'),
    path('api/analysis-history/', AnalysisResultView.as_view(), name = 'analysis-history'),
    path('api/variant-detection/', VariantDetectionView.as_view(), name='variant-detection'),
    path('api/sequence-alignment/', SequenceAlignmentView.as_view(), name='sequence-alignment'),
    path('api/orf-detection/', ORFDetectionView.as_view(), name='orf-detection'),
]
