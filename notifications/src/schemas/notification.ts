import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string(),
  type: z.enum(["info", "warning", "error", "success"]),
  text: z.string(),
  timestamp: z.number(), // server sends Date.now()
});

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationType = Notification["type"];
