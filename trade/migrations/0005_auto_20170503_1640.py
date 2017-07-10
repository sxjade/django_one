# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trade', '0004_auto_20170503_1627'),
    ]

    operations = [
        migrations.AlterField(
            model_name='delivery',
            name='delivkey',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='modes',
            name='modekey',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='places',
            name='plackey',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='product1',
            name='prokey',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='product2',
            name='prokey',
            field=models.CharField(max_length=20),
        ),
    ]
