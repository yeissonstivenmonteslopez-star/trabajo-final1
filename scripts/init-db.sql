-- init-db.sql
-- Populates the tipo_documento table with common Colombian document types.
-- Run this script after the schema has been created (db/database.sql).

USE bitclick;

INSERT INTO tipo_documento (codigo, nombre) VALUES
  ('CC',  'Cédula de Ciudadanía'),
  ('CE',  'Cédula de Extranjería'),
  ('PA',  'Pasaporte'),
  ('TI',  'Tarjeta de Identidad'),
  ('NIT', 'Número de Identificación Tributaria')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
