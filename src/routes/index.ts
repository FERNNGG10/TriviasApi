import { Router } from "express";
import prisma from "@config/database";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ message: "Trivia Api with Prisma", users: users });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
