from rest_framework import serializers
from .models import AnalysisResult

class AnalysisResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisResult
        fields = ['id', 'analysis_type', 'created_at']

class VariantDetectionSerializer(serializers.Serializer):
    reference_sequence = serializers.CharField()
    sample_sequence = serializers.CharField()

    def validate(self, data):
        if any(char not in {'A', 'T', 'G', 'C'} for char in data['reference_sequence']):
            raise serializers.ValidationError("Reference sequence contains invalid characters. Only A, T, G, C are allowed.")

        if any(char not in {'A', 'T', 'G', 'C'} for char in data['sample_sequence']):
            raise serializers.ValidationError("Sample sequence contains invalid characters. Only A, T, G, C are allowed.")
        return data

class SequenceAlignmentSerializer(serializers.Serializer):
    reference_sequence = serializers.CharField()
    sample_sequence = serializers.CharField()

    def validate(self, data):
        if any(char not in {'A', 'T', 'G', 'C'} for char in data['reference_sequence']):
            raise serializers.ValidationError("Reference sequence contains invalid characters. Only A, T, G, C are allowed.")

        if any(char not in {'A', 'T', 'G', 'C'} for char in data['sample_sequence']):
            raise serializers.ValidationError("Sample sequence contains invalid characters. Only A, T, G, C are allowed.")
        return data

class ORFDetectionSerializer(serializers.Serializer):
    input_sequence = serializers.CharField()

    def validate(self, data):
        if any(char not in {'A', 'T', 'G', 'C'} for char in data['input_sequence']):
            raise serializers.ValidationError("Input sequence contains invalid characters. Only A, T, G, C are allowed.")
        return data