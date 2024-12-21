CREATE TABLE new_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL
);

INSERT INTO new_users (message, name, email, phone)
SELECT message, name, email, phone FROM users;

DROP TABLE users;
ALTER TABLE new_users RENAME TO users;
