import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", table => {
    table.increments("id").primary();
    table.uuid("uuid").notNullable().unique();
    table.enum("status", ["INITIATED", "APPROVED", "PENDING", "REFUSED"]).notNullable();
    table.enum("payment_method", ["CREDIT_CARD", "PIX", "BANK_SLIP"]).notNullable();
    table.integer("value").notNullable();
    table.integer("attempts").defaultTo(1).notNullable();
    table.string("gateway_transaction_id").notNullable();
    table.string("credit_card_brand");
    table.integer("installments");
    table.integer("installments_value");
    table.string("digitable_line");
    table.string("barcode");
    table.text("qrcode");
    table.timestamp("expiration");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("orders");
}
