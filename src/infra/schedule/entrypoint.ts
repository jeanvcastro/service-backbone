import { appName } from "@/shared/env";
import * as schedule from "node-schedule";

import { handler as syncProducts } from "@/useCases/syncProducts/SyncProductsCommand";

// Run every day at 03:00
schedule.scheduleJob({ rule: "0 3 * * *", tz: "America/Sao_Paulo" }, async () => {
  await syncProducts();
});

process.on("SIGINT", function () {
  schedule.gracefulShutdown().then(() => process.exit(0));
});

console.log(`[${appName}]: Scheduled jobs started`);
