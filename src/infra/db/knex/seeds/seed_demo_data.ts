import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("sale_products").del();
  await knex("sales").del();
  await knex("products").del();

  const PRODUCT_1_UUID = "2ef04166-c309-4dab-935a-766a27340f09";
  const PRODUCT_2_UUID = "5a0739b5-099e-4bd1-85c4-cc69a6068cb9";
  const SALE_UUID = "52491141-8728-483a-bf1c-1a33d56c34b9";

  const [product1, product2] = await knex("products")
    .insert([
      { uuid: PRODUCT_1_UUID, name: "Product 1", price: 10000 },
      { uuid: PRODUCT_2_UUID, name: "Product 2", price: 5000 }
    ])
    .returning(["id", "price"]);

  const [{ id: saleId }] = await knex("sales")
    .insert({
      uuid: SALE_UUID,
      status: "APPROVED",
      payment_method: "CREDIT_CARD",
      value: 15000,
      attempts: 1,
      gateway_transaction_id: "TRX-001",
      credit_card_brand: "VISA",
      installments: 1,
      installments_value: 15000
    })
    .returning("id");

  await knex("sale_products").insert([
    {
      sale_id: saleId,
      product_id: product1.id,
      quantity: 1,
      price: product1.price
    },
    {
      sale_id: saleId,
      product_id: product2.id,
      quantity: 1,
      price: product2.price
    }
  ]);
}
