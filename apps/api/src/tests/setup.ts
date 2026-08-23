// apps/api/src/tests/setup.ts
import { execSync } from "child_process";
import { beforeAll, afterAll } from "vitest";
import { prisma } from "@repo/db";

beforeAll(() => {
  // pushes schema to the test DB before running (safe, non-destructive to dev DB)
  execSync("pnpm --filter @repo/db exec prisma db push --skip-generate", {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});