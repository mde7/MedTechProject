# Generated by Django 5.1.4 on 2024-12-23 15:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_analysisresult_analysis_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='analysisresult',
            name='input_sequence_1',
        ),
        migrations.RemoveField(
            model_name='analysisresult',
            name='input_sequence_2',
        ),
        migrations.RemoveField(
            model_name='analysisresult',
            name='result',
        ),
    ]
