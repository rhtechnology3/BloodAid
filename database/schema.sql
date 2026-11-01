-- BloodAid MySQL schema. Column names intentionally match the original
-- Spring Boot/JPA physical naming convention (snake_case) for compatibility.
CREATE DATABASE IF NOT EXISTS bloodaid_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bloodaid_db;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL DEFAULT '',
  password VARCHAR(255) NOT NULL,
  city VARCHAR(255) NULL,
  blood_group VARCHAR(255) NULL,
  age INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email)
);

CREATE TABLE IF NOT EXISTS donors (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NULL,
  age INT NOT NULL DEFAULT 0,
  blood_group VARCHAR(255) NULL,
  phone VARCHAR(255) NULL,
  city VARCHAR(255) NULL,
  available BIT(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS blood_requests (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  blood_group VARCHAR(255) NOT NULL,
  units INT NOT NULL,
  city VARCHAR(255) NOT NULL,
  hospital VARCHAR(255) NULL,
  required_date VARCHAR(255) NULL,
  urgency VARCHAR(255) NOT NULL,
  message VARCHAR(2000) NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'Active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_requests_status_created (status, created_at),
  KEY idx_requests_user_created (user_id, created_at),
  CONSTRAINT fk_requests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS donor_responses (
  id BIGINT NOT NULL AUTO_INCREMENT,
  request_id BIGINT NOT NULL,
  donor_user_id BIGINT NOT NULL,
  donor_name VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NULL,
  blood_group VARCHAR(255) NULL,
  city VARCHAR(255) NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'Interested',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_response_request_donor (request_id, donor_user_id),
  KEY idx_responses_user_created (donor_user_id, created_at),
  CONSTRAINT fk_responses_request FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_responses_user FOREIGN KEY (donor_user_id) REFERENCES users(id) ON DELETE CASCADE
);
