import { Request, Response } from "express";
import prisma from "@config/database";
import { getVapidPublicKey } from "@services/push-notification.service";

export const subscribe = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { endpoint, keys } = req.body;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({ 
      message: "Invalid subscription data. Required: endpoint, keys.p256dh, keys.auth" 
    });
  }

  try {
    // Check if subscription already exists
    const existing = await prisma.pushSubscription.findUnique({
      where: { endpoint },
    });

    if (existing) {
      // Update userId if different
      if (existing.userId !== userId) {
        await prisma.pushSubscription.update({
          where: { endpoint },
          data: { userId },
        });
      }
      return res.status(200).json({ 
        message: "Subscription already exists",
        subscription: existing 
      });
    }

    // Create new subscription
    const subscription = await prisma.pushSubscription.create({
      data: {
        userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });

    return res.status(201).json({ 
      message: "Subscription created successfully",
      subscription 
    });
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return res.status(500).json({ 
      message: "Failed to save subscription" 
    });
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { endpoint } = req.body;

  if (!endpoint) {
    return res.status(400).json({ 
      message: "Endpoint is required" 
    });
  }

  try {
    const subscription = await prisma.pushSubscription.findFirst({
      where: { 
        endpoint,
        userId 
      },
    });

    if (!subscription) {
      return res.status(404).json({ 
        message: "Subscription not found" 
      });
    }

    await prisma.pushSubscription.delete({
      where: { id: subscription.id },
    });

    return res.status(200).json({ 
      message: "Subscription deleted successfully" 
    });
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
    return res.status(500).json({ 
      message: "Failed to delete subscription" 
    });
  }
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
      select: {
        id: true,
        endpoint: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ 
      subscribed: subscriptions.length > 0,
      subscriptions 
    });
  } catch (error) {
    console.error("Error getting subscription status:", error);
    return res.status(500).json({ 
      message: "Failed to get subscription status" 
    });
  }
};

export const getVapidKey = async (_: Request, res: Response) => {
  const publicKey = getVapidPublicKey();
  
  if (!publicKey) {
    return res.status(500).json({ 
      message: "VAPID public key not configured" 
    });
  }

  return res.status(200).json({ publicKey });
};
