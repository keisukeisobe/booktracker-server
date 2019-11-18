BEGIN;

TRUNCATE
  ratings,
  books,
  genres,
  authors,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (username, password, email)
VALUES
  ('dunder', '$2a$12$/CwJvVbQbC7Bt2FMkSo.Be3vzvtT80Jt6eDr4acBAdk3DOlOhMU4K', 'info1@email.com'),
  ('b.deboop', '$2a$12$ue6zSpoMZ/Vnt5NKKwUB3eu.G6Xp/pIEED2xWeYkNFQMlUMQYa5YW', 'info2@email.com'),
  ('c.bloggs', '$2a$12$/g2wuzC6exjCgSKyWTD2b.5iyGNRTFiRaic5PGQmwg8b9e.UHMWgO', 'info3@email.com'),
  ('s.smith', '$2a$12$6D6uU8.iXtTi.n1OXYcUa.4wTVTUQheiP/2cWXuNBeooBJl7/5phS', 'info4@email.com'),
  ('lexlor', '$2a$12$fLK7yQMVy5yiGy.dzk6WkusbXKShUUxIQWPDRaUJKJzsHG2/V8KJO', 'info5@email.com'),
  ('wippy', '$2a$12$k/I6i7CD5zyp6TxzU5Le8.2Jz1h2sIK4tNFvF8dNLSo4W45CqI7Pa', 'info6@email.com');

INSERT INTO authors (name)
VALUES
  ('Brandon Sanderson'),
  ('Jim Butcher'),
  ('Patrick Rothfuss'),
  ('Steven Eriksen'),
  ('George R. R. Martin'),
  ('Robin Hobb'),
  ('J.R.R. Tolkien'),
  ('Philip K. Dick'),
  ('Stephanie Meyer'),
  ('Nora Roberts');

INSERT INTO genres (name)
VALUES
  ('Fantasy'),
  ('Science Fiction'),
  ('Romance');

INSERT INTO books (title, description, author_id, genre_id)
VALUES
  ('The Final Empire', 'Mistborn Book 1', 1, 1),
  ('Ubik', 'what is going on', 8, 2),
  ('Twilight', 'Twilight book 1', 9, 3);

INSERT INTO ratings (content, rating, book_id, user_id)
VALUES
  ('great', 5, 1, 1),
  ('confusing', 4, 2, 2),
  ('bad', 1, 3, 3);

COMMIT;