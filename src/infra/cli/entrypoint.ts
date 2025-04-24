import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import * as syncProducts from "@/useCases/syncProducts/SyncProductsCommand";

// Register commands
const commands = [syncProducts];

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
  .scriptName("cli")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .command(commands as any)
  .demandCommand()
  .strict()
  .help().argv;
