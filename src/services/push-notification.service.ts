import webPush from "web-push";
import prisma from "@config/database";

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@triviachallenge.online";

if (!vapidPublicKey || !vapidPrivateKey) {
  console.warn("VAPID keys not configured. Push notifications will not work.");
} else {
  webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const sendPushNotification = async (
  subscription: PushSubscriptionData,
  payload: string
): Promise<boolean> => {
  try {
    await webPush.sendNotification(subscription, payload);
    return true;
  } catch (error: any) {
    console.error("Error sending push notification:", error);
    
    // If subscription is invalid (410 Gone), return false to indicate removal
    if (error.statusCode === 410 || error.statusCode === 404) {
      return false;
    }
    
    throw error;
  }
};

export const sendPushToAllSubscriptions = async (
  payload: string
): Promise<void> => {
  const subscriptions = await prisma.pushSubscription.findMany();

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const subscription: PushSubscriptionData = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      const success = await sendPushNotification(subscription, payload);
      
      // Remove invalid subscriptions
      if (!success) {
        await prisma.pushSubscription.delete({
          where: { id: sub.id },
        });
      }
      
      return success;
    })
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  
  console.log(`Push notifications sent: ${successful} successful, ${failed} failed`);
};

export const getVapidPublicKey = (): string | undefined => {
  return vapidPublicKey;
};
