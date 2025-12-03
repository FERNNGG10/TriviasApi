import { Router } from "express";
import {
  subscribe,
  unsubscribe,
  getSubscriptionStatus,
  getVapidKey,
} from "@controllers/push-subscription.controller";
import passport from "passport";

const router = Router();

/**
 * @swagger
 * /push/vapid-public-key:
 *   get:
 *     summary: Get VAPID public key for push notifications
 *     tags: [Push Notifications]
 *     responses:
 *       200:
 *         description: VAPID public key
 *       500:
 *         description: VAPID key not configured
 */
router.get("/vapid-public-key", getVapidKey);

/**
 * @swagger
 * /push/subscribe:
 *   post:
 *     summary: Subscribe to push notifications
 *     tags: [Push Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - endpoint
 *               - keys
 *             properties:
 *               endpoint:
 *                 type: string
 *               keys:
 *                 type: object
 *                 properties:
 *                   p256dh:
 *                     type: string
 *                   auth:
 *                     type: string
 *     responses:
 *       201:
 *         description: Subscription created
 *       400:
 *         description: Invalid subscription data
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/subscribe",
  passport.authenticate("jwt", { session: false }),
  subscribe
);

/**
 * @swagger
 * /push/unsubscribe:
 *   delete:
 *     summary: Unsubscribe from push notifications
 *     tags: [Push Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - endpoint
 *             properties:
 *               endpoint:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subscription deleted
 *       404:
 *         description: Subscription not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/unsubscribe",
  passport.authenticate("jwt", { session: false }),
  unsubscribe
);

/**
 * @swagger
 * /push/status:
 *   get:
 *     summary: Get subscription status
 *     tags: [Push Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/status",
  passport.authenticate("jwt", { session: false }),
  getSubscriptionStatus
);

export default router;
