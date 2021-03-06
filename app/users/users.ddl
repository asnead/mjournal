CREATE TABLE "users"
(
  "id" serial NOT NULL,
  "email" character varying(256) NOT NULL,
  "theme" character varying(256),
  "created" timestamp with time zone NOT NULL DEFAULT now(),
  "bcryptedPassword" character(60) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY (id),
  CONSTRAINT "users_email_key" UNIQUE (email)
)
WITH (
  OIDS=FALSE
);

-- See https://raw.github.com/voxpelli/node-connect-pg-simple/master/table.sql
CREATE TABLE "public"."session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE "keys"
(
  "value" character varying(20) NOT NULL,
  "userId" integer NOT NULL,
  "valid" boolean NOT NULL DEFAULT true,
  CONSTRAINT value_pkey PRIMARY KEY (value),
  CONSTRAINT "keys_userId_fkey" FOREIGN KEY ("userId")
      REFERENCES "users" ("id") MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
