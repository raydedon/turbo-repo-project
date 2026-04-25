import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const connectionString = process.env.DATABASE_URL!.split('?')[0];
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
    super({ adapter: new PrismaPg(pool) });
  }
}
