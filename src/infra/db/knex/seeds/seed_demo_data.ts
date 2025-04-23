import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("order_products").del();
  await knex("orders").del();
  await knex("products").del();
  await knex("customers").del();

  const CUSTOMER_UUID = "f2b8c0d4-5a3e-4b1c-9f7d-6a0e1f2b3c4d";
  const PRODUCT_1_UUID = "2ef04166-c309-4dab-935a-766a27340f09";
  const PRODUCT_2_UUID = "5a0739b5-099e-4bd1-85c4-cc69a6068cb9";
  const ORDER_UUID = "52491141-8728-483a-bf1c-1a33d56c34b9";

  await knex("customers").insert({
    uuid: CUSTOMER_UUID,
    name: "Customer 1",
    email: "customer@email.com"
  });

  const [product1, product2] = await knex("products")
    .insert([
      { uuid: PRODUCT_1_UUID, name: "Product 1", price: 10000 },
      { uuid: PRODUCT_2_UUID, name: "Product 2", price: 5000 }
    ])
    .returning(["id", "price"]);

  const [{ id: orderId }] = await knex("orders")
    .insert({
      uuid: ORDER_UUID,
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

  await knex("order_products").insert([
    {
      order_id: orderId,
      product_id: product1.id,
      quantity: 1,
      price: product1.price
    },
    {
      order_id: orderId,
      product_id: product2.id,
      quantity: 1,
      price: product2.price
    }
  ]);
}
