"""Repair `api_booking` on databases that drifted from the models.

Symptom fixed: `POST /api/bookings/` returning 500 because the live table is
missing `email_sent` / `delivery_log` (or other current columns), or still has
legacy NOT NULL columns the model no longer fills. Inspects the live table, so
it is a no-op on up-to-date databases.
"""
from django.db import migrations


def repair(apps, schema_editor):
    Booking = apps.get_model("api", "Booking")
    conn = schema_editor.connection
    table = Booking._meta.db_table
    with conn.cursor() as cur:
        if table not in conn.introspection.table_names(cur):
            return
        live = {c.name: c for c in conn.introspection.get_table_description(cur, table)}

    # 1) add any model column that is missing
    for field in Booking._meta.local_fields:
        if field.column in live:
            continue
        kind = field.get_internal_type()
        raw = None
        if kind == "JSONField":
            raw = ("jsonb" if conn.vendor == "postgresql" else "text") + " NOT NULL DEFAULT '{}'"
        elif kind == "BooleanField":
            raw = "boolean NOT NULL DEFAULT false"
        if raw:
            with conn.cursor() as cur:
                cur.execute(f'ALTER TABLE "{table}" ADD COLUMN "{field.column}" {raw}')
        else:
            schema_editor.add_field(Booking, field)

    # 2) legacy columns the model no longer knows: make them nullable (postgres)
    known = {f.column for f in Booking._meta.local_fields}
    if conn.vendor == "postgresql":
        with conn.cursor() as cur:
            for name, col in live.items():
                if name not in known and not col.null_ok:
                    cur.execute(f'ALTER TABLE "{table}" ALTER COLUMN "{name}" DROP NOT NULL')


class Migration(migrations.Migration):
    dependencies = [("api", "0001_initial")]
    operations = [migrations.RunPython(repair, migrations.RunPython.noop)]
