CREATE TABLE IF NOT EXISTS students (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    gender VARCHAR(20),
    date_of_birth DATE,
    course VARCHAR(150) NOT NULL,
    year_of_study SMALLINT NOT NULL
        CHECK (year_of_study BETWEEN 1 AND 5),
    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),
    phone VARCHAR(30),
    address TEXT,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT students_first_name_valid
        CHECK (
            btrim(first_name) ~
            $name$^[[:alpha:]]([[:alpha:] '-]*[[:alpha:]])?$name$
        ),

    CONSTRAINT students_last_name_valid
        CHECK (
            btrim(last_name) ~
            $name$^[[:alpha:]]([[:alpha:] '-]*[[:alpha:]])?$name$
        ),

    CONSTRAINT students_email_format
        CHECK (
            email ~*
            '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$'
        ),

    CONSTRAINT students_gender_allowed
        CHECK (
            gender IS NULL OR
            gender IN ('Female', 'Male', 'Other', 'Prefer not to say')
        )
);
