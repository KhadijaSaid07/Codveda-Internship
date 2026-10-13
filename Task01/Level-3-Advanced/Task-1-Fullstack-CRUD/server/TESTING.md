# Student Record Management System — Backend Testing

## Environment
- Backend: Node.js, Express
- Database: PostgreSQL
- API base URL: http://localhost:5000/api

## Verified Tests

| Test | Expected result | Actual result | Status |
|---|---|---|---|
| Database health check | HTTP 200, database connected | Passed | PASS |
| List students | HTTP 200, five original records | Count was 5 | PASS |
| Search students by name | HTTP 200, matching records | Khadija search returned one record | PASS |
| Invalid year filter (`year=99`) | HTTP 400 | Returned HTTP 400 | PASS |
| Invalid student name on create | HTTP 400 | Returned HTTP 400 | PASS |
| Create valid student | HTTP 201 | Temporary test student created | PASS |
| Get existing student by ID | HTTP 200 | Returned the created student | PASS |
| Get nonexistent student | HTTP 404 | Returned HTTP 404 | PASS |
| Get student with nonnumeric ID | HTTP 400 | Returned HTTP 400 | PASS |
| Update existing student | HTTP 200 | Updated test student's details | PASS |
| Reject invalid name on update | HTTP 400 | Returned HTTP 400 | PASS |
| Delete existing student | HTTP 200 | Temporary student ID 7 deleted successfully | PASS |
| Confirm deletion | Student absent; original records preserved | Student list returned count 5 | PASS |
| Duplicate registration number | HTTP 409 | Returned HTTP 409 | PASS |
| Duplicate email address | HTTP 409 | Returned HTTP 409 | PASS |

## Data Integrity
- The five original student records remained in the database after CRUD testing.
- Temporary test records were removed.
- Duplicate registration numbers and email addresses were rejected.

## Notes
- Run the tests against the local development database.
- Do not include database passwords, API secrets, or other credentials in this file.
- Re-run relevant tests after changing API routes, validation, or database logic.
