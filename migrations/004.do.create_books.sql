CREATE TABLE books (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_published TIMESTAMP DEFAULT now() NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  date_modified TIMESTAMP,
  author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE NOT NULL,
  genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE NOT NULL
);