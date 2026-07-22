import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
  WarningFilled,
} from "@ant-design/icons";
import { List, theme, Typography } from "antd";
import ReactMarkdown from "react-markdown";
import type { Notification as NotificationData, NotificationType } from "../schemas/notification";

interface NotificationProps {
  notification: NotificationData;
}

const ICONS: Record<NotificationType, typeof InfoCircleFilled> = {
  info: InfoCircleFilled,
  success: CheckCircleFilled,
  warning: WarningFilled,
  error: CloseCircleFilled,
};

export function Notification({ notification }: NotificationProps) {
  const { token } = theme.useToken();

  const colors: Record<NotificationType, string> = {
    info: token.colorInfo,
    success: token.colorSuccess,
    warning: token.colorWarning,
    error: token.colorError,
  };

  const Icon = ICONS[notification.type];
  const color = colors[notification.type];
  const time = new Date(notification.timestamp).toLocaleTimeString();

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Icon style={{ color, fontSize: 20 }} aria-label={notification.type} />}
        title={
          <div className="notification-text">
            <ReactMarkdown>{notification.text}</ReactMarkdown>
          </div>
        }
      />
      <Typography.Text type="secondary" className="notification-time">
        {time}
      </Typography.Text>
    </List.Item>
  );
}
