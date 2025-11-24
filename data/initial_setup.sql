INSERT INTO
    roles (name)
VALUES 
    ('Admin'),
    ('User')
ON CONFLICT DO NOTHING;

INSERT INTO
    users (name, email, password_hash, role_id)
SELECT
    'Kyo Terada',
    'sitiang120@gmail.com',
    '$2b$12$luRkd0.boAmPusBdZlOyNuiIr3uXr2Cwgd4lqIzpJ2a.Wyqo/IKCi',
    role_id
FROM
    roles
WHERE
    name LIKE 'Admin';
