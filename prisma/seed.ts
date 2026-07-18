import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@terminal.local" },
    update: {},
    create: { email: "demo@terminal.local", name: "Demo Trader", passwordHash },
  });

  await prisma.scannerCondition.upsert({
    where: { key: "book_value_gt_cmp" },
    update: {},
    create: {
      key: "book_value_gt_cmp",
      label: "Book value per share > current market price",
      expression: "book_value_per_share > current_market_price",
    },
  });

  await prisma.watchlist.upsert({
    where: { id: "demo-watchlist" },
    update: {},
    create: {
      id: "demo-watchlist",
      userId: user.id,
      name: "Value radar",
      items: {
        create: [
          { symbol: "TATASTEEL", exchange: "NSE", token: "3499", companyName: "Tata Steel" },
        ],
      },
    },
  });
}

main().finally(async () => prisma.$disconnect());
