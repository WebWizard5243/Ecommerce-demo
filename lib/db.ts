import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  last_updated: string;
  image_urls?: string[];
  image_public_ids?: string[];
}

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res;
}

export async function getAllProducts(): Promise<Product[]> {
  const { rows } = await query('SELECT * FROM products ORDER BY name');
  return rows;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { rows } = await query('SELECT * FROM products WHERE slug = $1', [slug]);
  return rows[0] || null;
}

export async function getProductById(id: number): Promise<Product | null> {
  const { rows } = await query('SELECT * FROM products WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function createProduct(
  product: Omit<Product, 'id' | 'last_updated'>
): Promise<Product> {
  const { rows } = await query(
    `INSERT INTO products (name, slug, description, price, category, inventory, image_urls, image_public_ids)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      product.name,
      product.slug,
      product.description,
      product.price,
      product.category,
      product.inventory,
      product.image_urls || null,
      product.image_public_ids || null,
    ]
  );
  return rows[0];
}

export async function updateProduct(
  id: number,
  updates: Partial<Omit<Product, 'id'>>
): Promise<Product | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id') {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  fields.push(`last_updated = NOW()`);
  values.push(id);

  const { rows } = await query(
    `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return rows[0] || null;
}

export async function getLowStockProducts(threshold: number = 30): Promise<Product[]> {
  const { rows } = await query(
    'SELECT * FROM products WHERE inventory < $1 ORDER BY inventory ASC',
    [threshold]
  );
  return rows;
}

export async function getInventoryStats() {
  const { rows } = await query(`
    SELECT 
      COUNT(*) as total_products,
      SUM(inventory) as total_inventory,
      COUNT(*) FILTER (WHERE inventory < 30) as low_stock_count,
      AVG(price) as avg_price
    FROM products
  `);
  return rows[0];
}
