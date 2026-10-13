-- Khadija's details were supplied by the user.
-- The other records are fictional development data.
INSERT INTO students (
    registration_number,
    first_name,
    last_name,
    email,
    gender,
    course,
    year_of_study,
    phone,
    address
)
VALUES
(
    '24BCS026',
    'Khadija',
    'Said',
    'khadija09said09@gmail.com',
    'Female',
    'Bachelor of Science in Computer Science',
    3,
    '0675788310',
    'Kibweni, Zanzibar'
),
(
    '24BCS027',
    'Amina',
    'Hassan',
    'amina.hassan@gmail.com',
    'Female',
    'Bachelor of Science in Computer Science',
    3,
    '0671000001',
    'Mwanakwerekwe, Zanzibar'
),
(
    '24BCS028',
    'Yusuf',
    'Ali',
    'yusuf.ali@gmail.com',
    'Male',
    'Bachelor of Science in Computer Science',
    3,
    '0671000002',
    'Chake Chake, Pemba'
),
(
    '24BCS029',
    'Neema',
    'Juma',
    'neema.juma@gmail.com',
    'Female',
    'Bachelor of Science in Computer Science',
    2,
    '0671000003',
    'Fuoni, Zanzibar'
),
(
    '24BCS030',
    'Hamza',
    'Omar',
    'hamza.omar@gmail.com',
    'Male',
    'Bachelor of Science in Computer Science',
    4,
    '0671000004',
    'Stone Town, Zanzibar'
)
ON CONFLICT DO NOTHING;
