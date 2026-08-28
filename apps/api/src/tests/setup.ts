// apps/api/src/tests/setup.ts
import { execSync } from "child_process";
import { beforeAll, afterAll } from "vitest";
import { prisma } from "@repo/db";
import { env } from "@repo/env";

beforeAll(() => {
  console.log("TEST DATABASE:", env.TEST_DATABASE_URL);

  execSync(
    "pnpm --filter @repo/db exec prisma --version",
    {
      env: {
        ...process.env,
        DATABASE_URL: env.TEST_DATABASE_URL,
      },
      stdio: "inherit",
    }
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});