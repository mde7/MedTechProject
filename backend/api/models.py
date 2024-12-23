from django.db import models

# Create your models here.
class AnalysisResult(models.Model):
    ANALYSIS_TYPES = {
        'variant_detection': 'Variant Detection',
        'sequence_alignment': 'Sequence Alignment',
        'orf_detection': 'ORF Detection'
    }

    analysis_type = models.CharField(max_length=19, choices=ANALYSIS_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
