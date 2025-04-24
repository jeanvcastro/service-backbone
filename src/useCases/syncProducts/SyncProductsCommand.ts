import { configureDI } from "./di";
import { SyncProductsInputValidator } from "./SyncProductsInputValidator";

export const command = "sync-products";
export const describe = "Sync products from external source";
export const builder = {};

export const handler = async () => {
  const container = configureDI();
  const useCase = container.get("SyncProductsUseCase");
  const logger = container.get("LoggingService");

  try {
    const externalProducts = [
      { uuid: "de2cee80-2d38-4dda-ac5d-c7dd56154959", name: "Product 3", price: 500 },
      { uuid: "9fe3327f-2a02-4899-8d09-61d5ddbe9ae7", name: "Product 4", price: 600 }
    ];

    SyncProductsInputValidator.parse({
      products: externalProducts
    });

    await useCase.execute({
      products: externalProducts
    });

    logger.info("✅ Products synced successfully.");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Error syncing products.");
    logger.error(error);
    process.exit(1);
  }
};
