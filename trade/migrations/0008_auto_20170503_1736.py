# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trade', '0007_auto_20170503_1731'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deposit',
            name='deposkey',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='deposit',
            name='deposvalue',
            field=models.IntegerField(),
        ),
    ]
