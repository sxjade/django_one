# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trade', '0005_auto_20170503_1640'),
    ]

    operations = [
        migrations.CreateModel(
            name='Delivme',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('delivmvkey', models.CharField(max_length=20)),
                ('delivmv', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Deposit',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('deposkey', models.IntegerField()),
                ('depos', models.CharField(max_length=20)),
                ('updatetime', models.DateTimeField()),
            ],
        ),
    ]
