CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgjwt;

-- CREATE TABLE "user" (
-- 	id SERIAL PRIMARY KEY,
-- 	email TEXT NOT NULL UNIQUE,
-- 	username TEXT NOT NULL UNIQUE,
-- 	firstname TEXT NOT NULL,
-- 	lastname TEXT NOT NULL,
-- 	password TEXT NOT NULL,
-- 	created_at TIMESTAMPTZ DEFAULT 
--     now() NOT NULL
-- );

-- Drop function first, then type, to avoid dependency errors
DROP FUNCTION IF EXISTS public.login_user(TEXT, TEXT);
DROP TYPE IF EXISTS public.login_response;
-- Create a type for login response
CREATE TYPE public.login_response AS (
    user_row public."user",
    jwt_token TEXT
);

-- Function to sign up a new user
CREATE OR REPLACE FUNCTION public.signup_user(
    p_email TEXT,
    p_username TEXT,
    p_firstname TEXT,
    p_lastname TEXT,
    p_password TEXT
)
RETURNS public."user" AS $$
DECLARE
    new_user public."user";
BEGIN
    INSERT INTO public."user" (email, username, firstname, lastname, password)
    VALUES (
        p_email,
        p_username,
        p_firstname,
        p_lastname,
        crypt(p_password, gen_salt('bf'))
    )
    RETURNING * INTO new_user;
    RETURN new_user;
EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'User with this email or username already exists.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to login a user and return JWT token
CREATE OR REPLACE FUNCTION public.login_user(
    p_email TEXT,
    p_password TEXT
)
RETURNS public.login_response AS $$
DECLARE
    found_user public."user";
    result public.login_response;
BEGIN
    SELECT * INTO found_user FROM public."user"
    WHERE email = p_email AND password = crypt(p_password, password);
    IF found_user.id IS NULL THEN
        RAISE EXCEPTION 'Invalid email or password.';
    END IF;
    result.user_row := found_user;
    -- Generate JWT token using pgjwt's sign function
    result.jwt_token := sign(row_to_json(found_user)::json, 'your_jwt_secret');
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table to track user queries
CREATE TABLE IF NOT EXISTS user_queries (
  user_id INT PRIMARY KEY REFERENCES "user"(id),
  queries_left INT NOT NULL DEFAULT 25,
  last_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger function to insert into user_queries after user creation
CREATE OR REPLACE FUNCTION public.create_user_queries_entry()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_queries (user_id, queries_left, last_reset_at)
  VALUES (NEW.id, 25, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on user table
CREATE TRIGGER user_queries_after_insert
AFTER INSERT ON "user"
FOR EACH ROW
EXECUTE FUNCTION public.create_user_queries_entry();

-- Function to decrement queries_left for a user
CREATE OR REPLACE FUNCTION public.decrement_user_query(p_user_id INT)
RETURNS BOOLEAN AS $$
DECLARE
  current_queries INT;
BEGIN
  SELECT queries_left INTO current_queries FROM user_queries WHERE user_id = p_user_id FOR UPDATE;
  IF current_queries IS NULL THEN
    RAISE EXCEPTION 'User not found in user_queries';
  END IF;
  IF current_queries > 0 THEN
    UPDATE user_queries SET queries_left = queries_left - 1 WHERE user_id = p_user_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to reset queries_left for all users
CREATE OR REPLACE FUNCTION public.reset_all_user_queries()
RETURNS VOID AS $$
BEGIN
  UPDATE user_queries SET queries_left = 25, last_reset_at = NOW();
END;
$$ LANGUAGE plpgsql;

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'reset_user_queries_multiple',
  '0 9,13,19 * * *',
  $$
  UPDATE public.user_queries
  SET queries_left = 25,
      last_reset_at = NOW();
  $$
);
