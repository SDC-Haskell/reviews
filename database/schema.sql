CREATE DATABASE reviewdb;

\c reviewdb;

CREATE TABLE reviews (
  id integer NOT NULL PRIMARY KEY,
  product_id integer NOT NULL,
  rating integer NOT NULL,
  date date,
  summary varchar(500),
  body varchar(1000),
  recommend boolean,
  reported boolean,
  reviewer_name varchar(100),
  reviewer_email varchar(100),
  response varchar(1000),
  helpfulness integer
);

--MAYBE add another table to hold counts of review characteristics and recommendations? Down the road...

CREATE TABLE characteristic_reviews (
  id integer NOT NULL PRIMARY KEY,
  characteristic_id integer,
  review_id integer NOT NULL,
  value integer
);

CREATE TABLE characteristics (
  id integer NOT NULL PRIMARY KEY,
  product_id integer NOT NULL,
  name varchar(50)
);

CREATE TABLE reviews_photos (
  id integer NOT NULL PRIMARY KEY,
  review_id integer NOT NULL,
  url varchar(200)
);

COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/home/baja/SDC/reviews/database/reviews.csv' --path to file
DELIMITER ','
CSV HEADER;

COPY characteristic_reviews(id, characteristic_id, review_id, value)
FROM '/home/baja/SDC/reviews/database/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(id, product_id, name)
FROM '/home/baja/SDC/reviews/database/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY reviews_photos(id, review_id, url)
FROM '/home/baja/SDC/reviews/database/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

-- su postgres
-- psql < database/schema.sql
