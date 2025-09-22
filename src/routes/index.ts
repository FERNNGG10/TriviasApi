import { Router } from "express";
import prisma from "@config/database";

const router = Router();

router.get("/", async (req, res) => {
  const roles = await prisma.role.findMany();
  console.log(roles);
  return res.json({ message: "API is running" });
});

export default router;
