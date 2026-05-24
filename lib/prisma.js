import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis;

// 1. Create a native PostgreSQL connection pool via your env URL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Instantiate Prisma 7's explicit driver adapter interface wrapper
const adapter = new PrismaPg(pool);

// 3. Pass the active adapter object directly into the standard client constructor options block
export const DB = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = DB;