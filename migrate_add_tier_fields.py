#!/usr/bin/env python3
"""
Database Migration Script - Add Freemium Tier Fields
Phase 2: Workflow Tagging System

This script adds the following columns to the workflows table:
- tier: Workflow access tier (free, starter, pro, business)
- tier_complexity: Technical complexity (simple, intermediate, advanced)
- is_lead_magnet: Boolean flag for lead magnet workflows
- requires_login: Boolean flag for login requirement

Usage:
    python migrate_add_tier_fields.py
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = "database/workflows.db"

def backup_database():
    """Create a backup of the database before migration."""
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found: {DB_PATH}")
        return False

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"database/workflows_backup_{timestamp}.db"

    print(f"📦 Creating backup: {backup_path}")

    import shutil
    shutil.copy2(DB_PATH, backup_path)
    print(f"✅ Backup created successfully")
    return True

def check_column_exists(conn, table_name, column_name):
    """Check if a column already exists in the table."""
    cursor = conn.execute(f"PRAGMA table_info({table_name})")
    columns = [row[1] for row in cursor.fetchall()]
    return column_name in columns

def migrate_database():
    """Add tier-related columns to the workflows table."""
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found: {DB_PATH}")
        print("   Run 'python run.py' first to create the database")
        return False

    # Create backup
    if not backup_database():
        return False

    print("\n🔄 Starting database migration...")

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check and add 'tier' column
        if not check_column_exists(conn, 'workflows', 'tier'):
            print("  ➕ Adding 'tier' column...")
            cursor.execute("""
                ALTER TABLE workflows
                ADD COLUMN tier TEXT DEFAULT 'pro'
            """)
            print("     ✅ 'tier' column added")
        else:
            print("  ℹ️  'tier' column already exists")

        # Check and add 'tier_complexity' column
        if not check_column_exists(conn, 'workflows', 'tier_complexity'):
            print("  ➕ Adding 'tier_complexity' column...")
            cursor.execute("""
                ALTER TABLE workflows
                ADD COLUMN tier_complexity TEXT DEFAULT 'intermediate'
            """)
            print("     ✅ 'tier_complexity' column added")
        else:
            print("  ℹ️  'tier_complexity' column already exists")

        # Check and add 'is_lead_magnet' column
        if not check_column_exists(conn, 'workflows', 'is_lead_magnet'):
            print("  ➕ Adding 'is_lead_magnet' column...")
            cursor.execute("""
                ALTER TABLE workflows
                ADD COLUMN is_lead_magnet BOOLEAN DEFAULT 0
            """)
            print("     ✅ 'is_lead_magnet' column added")
        else:
            print("  ℹ️  'is_lead_magnet' column already exists")

        # Check and add 'requires_login' column
        if not check_column_exists(conn, 'workflows', 'requires_login'):
            print("  ➕ Adding 'requires_login' column...")
            cursor.execute("""
                ALTER TABLE workflows
                ADD COLUMN requires_login BOOLEAN DEFAULT 1
            """)
            print("     ✅ 'requires_login' column added")
        else:
            print("  ℹ️  'requires_login' column already exists")

        conn.commit()

        # Create index on tier for fast filtering
        print("  🔍 Creating index on 'tier' column...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_tier ON workflows(tier)
        """)
        print("     ✅ Index created")

        # Create index on tier_complexity
        print("  🔍 Creating index on 'tier_complexity' column...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_tier_complexity ON workflows(tier_complexity)
        """)
        print("     ✅ Index created")

        # Create index on is_lead_magnet
        print("  🔍 Creating index on 'is_lead_magnet' column...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_is_lead_magnet ON workflows(is_lead_magnet)
        """)
        print("     ✅ Index created")

        conn.commit()

        # Verify columns were added
        print("\n📊 Verifying schema...")
        cursor.execute("PRAGMA table_info(workflows)")
        columns = cursor.fetchall()

        tier_cols = ['tier', 'tier_complexity', 'is_lead_magnet', 'requires_login']
        found_cols = [col[1] for col in columns if col[1] in tier_cols]

        print(f"  Found columns: {', '.join(found_cols)}")

        if len(found_cols) == 4:
            print("\n✅ Migration completed successfully!")
            print("\n📋 Next steps:")
            print("  1. Update workflow_db.py to handle new columns")
            print("  2. Tag 5-10 workflows for free tier")
            print("  3. Run 'python run.py --reindex' to update database")
            return True
        else:
            print(f"\n⚠️  Migration incomplete. Expected 4 columns, found {len(found_cols)}")
            return False

    except sqlite3.Error as e:
        print(f"\n❌ Migration error: {e}")
        return False
    finally:
        conn.close()

def show_schema():
    """Display current workflows table schema."""
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found: {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("\n📋 Current workflows table schema:")
    print("=" * 80)
    cursor.execute("PRAGMA table_info(workflows)")
    columns = cursor.fetchall()

    for col in columns:
        col_id, name, col_type, not_null, default, pk = col
        print(f"  {name:<25} {col_type:<15} {'NOT NULL' if not_null else '':<10} {'PK' if pk else '':<5}")
        if default is not None:
            print(f"{'':>27} DEFAULT: {default}")
    print("=" * 80)

    # Show indexes
    print("\n🔍 Indexes:")
    cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='index' AND tbl_name='workflows'")
    indexes = cursor.fetchall()
    for idx_name, idx_sql in indexes:
        if idx_sql:  # Skip auto-created indexes
            print(f"  {idx_name}")

    conn.close()

if __name__ == "__main__":
    print("=" * 80)
    print("  DATABASE MIGRATION - Add Freemium Tier Fields")
    print("  Phase 2: Workflow Tagging System")
    print("=" * 80)
    print()

    # Show current schema
    show_schema()

    # Confirm migration
    response = input("\n❓ Proceed with migration? (yes/no): ").strip().lower()

    if response in ['yes', 'y']:
        success = migrate_database()
        if success:
            print("\n" + "=" * 80)
            show_schema()
        print()
    else:
        print("\n❌ Migration cancelled by user")
