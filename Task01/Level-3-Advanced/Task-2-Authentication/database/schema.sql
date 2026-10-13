CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_full_name_not_blank
        CHECK (LENGTH(TRIM(full_name)) > 0),
    CONSTRAINT users_email_not_blank
        CHECK (LENGTH(TRIM(email)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_users_created_at
    ON users (created_at DESC);
