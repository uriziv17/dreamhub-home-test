import { List } from "antd";
import type { Notification as NotificationData } from "../schemas/notification";
import { Notification } from "./Notification";

interface NotificationListProps {
  notifications: NotificationData[];
  hasReceivedAny: boolean;
}

export function NotificationList({ notifications, hasReceivedAny }: NotificationListProps) {
  const emptyText = hasReceivedAny
    ? "No notifications match your filter."
    : "Waiting for notifications…";

  return (
    <List
      dataSource={notifications}
      locale={{ emptyText }}
      renderItem={(notification) => (
        <Notification key={notification.id} notification={notification} />
      )}
    />
  );
}
