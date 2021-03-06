CREATE TABLE progress (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    percent DECIMAL DEFAULT 0 NOT NULL,
    reading_status TEXT NOT NULL,
    pagecount INTEGER NOT NULL,
    maxpagecount INTEGER NOT NULL
);