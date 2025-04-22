import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sale_products", table => {
    table.increments("id").primary();
    table.integer("sale_id").unsigned().notNullable().references("id").inTable("sales").onDelete("CASCADE");
    table.integer("product_id").unsigned().notNullable().references("id").inTable("products").onDelete("RESTRICT");
    table.integer("quantity").defaultTo(1).notNullable();
    table.integer("price").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("sale_products");
}
