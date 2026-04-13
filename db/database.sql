CREATE DATABASE IF NOT EXISTS bitclick
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bitclick;


CREATE TABLE tipo_documento (
  id        TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo    VARCHAR(5)  NOT NULL UNIQUE,   -- TI, CC, TE, CE, PAS
  nombre    VARCHAR(60) NOT NULL
);

INSERT INTO tipo_documento (codigo, nombre) VALUES
  ('TI',  'Tarjeta de Identidad'),
  ('CC',  'Cédula de Ciudadanía'),
  ('TE',  'Tarjeta de Extranjería'),
  ('CE',  'Cédula de Extranjería'),
  ('PAS', 'Pasaporte');


CREATE TABLE usuarios (
  id                INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  nombre_completo   VARCHAR(120)     NOT NULL,
  tipo_documento_id TINYINT UNSIGNED NOT NULL,
  numero_documento  VARCHAR(20)      NOT NULL,
  email             VARCHAR(180)     NOT NULL UNIQUE,
  prefijo_telefono  VARCHAR(5)       NOT NULL DEFAULT '+57',
  telefono          VARCHAR(15)      NOT NULL,
  password_hash     VARCHAR(255)     NOT NULL,   -- bcrypt / Argon2
  activo            TINYINT(1)       NOT NULL DEFAULT 1,
  creado_en         DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_usuario_tipo_doc
    FOREIGN KEY (tipo_documento_id)
    REFERENCES tipo_documento(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  UNIQUE KEY uq_documento (tipo_documento_id, numero_documento)
);


CREATE TABLE sesiones (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT UNSIGNED  NOT NULL,
  token       CHAR(64)      NOT NULL UNIQUE,   -- SHA-256 hex
  ip          VARCHAR(45),                     -- IPv4 / IPv6
  user_agent  VARCHAR(255),
  expira_en   DATETIME      NOT NULL,
  creado_en   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_sesion_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);


CREATE TABLE recuperacion_password (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT UNSIGNED NOT NULL,
  token       CHAR(64)     NOT NULL UNIQUE,
  expira_en   DATETIME     NOT NULL,
  usado       TINYINT(1)   NOT NULL DEFAULT 0,
  creado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_recuperacion_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);


CREATE INDEX idx_usuarios_email    ON usuarios(email);
CREATE INDEX idx_sesiones_token    ON sesiones(token);
CREATE INDEX idx_sesiones_expira   ON sesiones(expira_en);