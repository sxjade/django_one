# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trade', '0006_delivme_deposit'),
    ]

    operations = [
        migrations.AddField(
            model_name='deposit',
            name='deposvalue',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='deposit',
            name='deposkey',
            field=models.CharField(default=b'zg', max_length=20),
        ),
    ]
