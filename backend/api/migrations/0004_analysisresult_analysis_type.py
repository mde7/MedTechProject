# Generated by Django 5.1.4 on 2024-12-19 18:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_analysisresult_analysis_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='analysisresult',
            name='analysis_type',
            field=models.CharField(choices=[('variant_detection', 'Variant Detection'), ('sequence_alignment', 'Sequence Alignment'), ('orf_detection', 'ORF Detection')], default='Variant Detection', max_length=19),
            preserve_default=False,
        ),
    ]
