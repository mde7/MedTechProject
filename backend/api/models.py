from django.db import models

# Create your models here.
class AnalysisResult(models.Model):
    ANALYSIS_TYPES = {
        'variant_detection': 'Variant Detection',
        'sequence_alignment': 'Sequence Alignment',
        'orf_detection': 'ORF Detection'
    }

    analysis_type = models.CharField(max_length=19, choices=ANALYSIS_TYPES)
    input_sequence_1 = models.TextField()
    input_sequence_2 = models.TextField(blank=True, null=True)
    result = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
