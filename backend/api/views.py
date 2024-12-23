from django.db.models import Count
from django.db.models.functions import TruncDate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from .serializers import AnalysisResultSerializer, VariantDetectionSerializer, SequenceAlignmentSerializer, ORFDetectionSerializer
from .analysis import variant_detection, sequence_alignment, orf_detection
from .models import AnalysisResult
# Create your views here.

class RadarChartView(APIView):
    def get(self, request):
        data = AnalysisResult.objects.values('analysis_type').annotate(count=Count('analysis_type'))

        radar_data = [{"analysis_type": item['analysis_type'],
                      "analysis_count": item['count']} for item in data]

        return Response(radar_data, status=status.HTTP_200_OK)

class AreaChartView(APIView):
    def get(self, request):
        data = AnalysisResult.objects.annotate(date=TruncDate('created_at')).values('date', 'analysis_type').annotate(count=Count('analysis_type'))

        area_data = {}

        for entry in data:
            date = entry['date'].strftime('%Y-%m-%d')
            type = entry['analysis_type']
            count = entry['count']

            if not date in area_data:
                area_data[date] = {}
            
            area_data[date][type] = count
        
        return Response(area_data, status=status.HTTP_200_OK)

class VariantDetectionView(APIView):
    def post(self, request):
        serializer = VariantDetectionSerializer(data=request.data)

        if serializer.is_valid():
            reference_sequence = serializer.validated_data['reference_sequence']
            sample_sequence = serializer.validated_data['sample_sequence']

            result = variant_detection(reference_sequence, sample_sequence)

            data = {
                'analysis_type': 'variant_detection'
            }

            db_serializer = AnalysisResultSerializer(data=data)

            if db_serializer.is_valid():
                db_serializer.save()
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response(db_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class SequenceAlignmentView(APIView):
    def post(self, request):
        serializer = SequenceAlignmentSerializer(data=request.data)

        if serializer.is_valid():
            reference_sequence = serializer.validated_data['reference_sequence']
            sample_sequence = serializer.validated_data['sample_sequence']

            result = sequence_alignment(reference_sequence, sample_sequence)

            data = {
                'analysis_type': 'sequence_alignment'
            }

            db_serializer = AnalysisResultSerializer(data=data)

            if db_serializer.is_valid():
                db_serializer.save()
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response(db_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

class ORFDetectionView(APIView):
    def post(self, request):
        serializer = ORFDetectionSerializer(data=request.data)

        if serializer.is_valid():
            input_sequence = serializer.validated_data['input_sequence']

            result = orf_detection(input_sequence)

            data = {
                'analysis_type': 'orf_detection'
            }

            db_serializer = AnalysisResultSerializer(data=data)
            
            if db_serializer.is_valid():
                db_serializer.save()
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response(db_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)