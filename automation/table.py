import asyncio
import os

import asyncpg

SCHEMA_STATEMENTS = [
    """
    CREATE TABLE IF NOT EXISTS sync_status (
        name TEXT PRIMARY KEY,
        last_synced_block BIGINT NOT NULL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS subscriptions (
        sub_id INTEGER NOT NULL,
        module TEXT NOT NULL,
        subscriber TEXT NOT NULL,
        recipient TEXT NOT NULL,
        amount BIGINT NOT NULL,
        frequency BIGINT NOT NULL,
        redeem_at BIGINT NOT NULL,
        created_block BIGINT NOT NULL,
        PRIMARY KEY (sub_id, module)
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_subscriptions_redeem ON subscriptions(redeem_at);",
    "CREATE INDEX IF NOT EXISTS idx_subscriptions_sub_module ON subscriptions(sub_id, module);",
    """
    INSERT INTO sync_status (name, last_synced_block)
    VALUES ('main', 0)
    ON CONFLICT (name) DO NOTHING;
    """,
]


async def create_tables():
    conn = None
    try:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise ValueError("DATABASE_URL environment variable is not set")

        conn = await asyncpg.connect(database_url)
        for statement in SCHEMA_STATEMENTS:
            await conn.execute(statement)
        print("Schema created successfully.")
    except Exception as e:
        print(f"Error creating schema: {e}")
        raise
    finally:
        if conn:
            await conn.close()


if __name__ == "__main__":
    asyncio.run(create_tables())
