DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
  id serial NOT NULL,
  age integer,
  kind text,
  name text
);

