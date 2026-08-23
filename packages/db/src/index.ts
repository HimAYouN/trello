// packages/db/src/index.ts
import { PrismaClient } from "../generated/client.ts"; // or "@prisma/client" if using default output
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@repo/env";

const connectionString = env.DATABASE_URL!;
console.log(connectionString)

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });

// re-export generated types so consumers don't need to reach into "generated/client" themselves
export * from "../generated/client";