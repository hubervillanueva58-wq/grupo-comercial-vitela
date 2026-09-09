CREATE TABLE IF NOT EXISTS products (
  sku TEXT PRIMARY KEY,
  modelo TEXT NOT NULL,
  tam INTEGER NOT NULL,
  color TEXT NOT NULL,
  precio REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  descripcion TEXT NOT NULL DEFAULT '',
  activo INTEGER NOT NULL DEFAULT 1,
  categoria TEXT NOT NULL DEFAULT 'menudeo',
  imagenes TEXT NOT NULL DEFAULT '[]',
  caracteristicas TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_products_categoria_activo ON products(categoria, activo);
