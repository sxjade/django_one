# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trade', '0002_auto_20170502_1720'),
    ]

    operations = [
        migrations.AlterField(
            model_name='industry',
            name='reportfile',
            field=models.FileField(upload_to=b'./upload'),
        ),
    ]
