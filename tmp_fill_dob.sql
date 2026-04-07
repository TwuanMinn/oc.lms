-- Fill date_of_birth for all users that currently have NULL
-- Uses role-based age ranges with a deterministic random seeded by user id

UPDATE users
SET date_of_birth = (
  CASE role
    WHEN 'STUDENT' THEN
      (CURRENT_DATE - INTERVAL '1 year' * (17 + (abs(hashtext(id::text)) % 9)))
        + (abs(hashtext(id::text || 'month')) % 334) * INTERVAL '1 day'
    WHEN 'TEACHER' THEN
      (CURRENT_DATE - INTERVAL '1 year' * (25 + (abs(hashtext(id::text)) % 21)))
        + (abs(hashtext(id::text || 'month')) % 334) * INTERVAL '1 day'
    WHEN 'ADMIN' THEN
      (CURRENT_DATE - INTERVAL '1 year' * (30 + (abs(hashtext(id::text)) % 21)))
        + (abs(hashtext(id::text || 'month')) % 334) * INTERVAL '1 day'
    ELSE
      (CURRENT_DATE - INTERVAL '1 year' * (20 + (abs(hashtext(id::text)) % 20)))
        + (abs(hashtext(id::text || 'month')) % 334) * INTERVAL '1 day'
  END
)::date::text
WHERE date_of_birth IS NULL;
