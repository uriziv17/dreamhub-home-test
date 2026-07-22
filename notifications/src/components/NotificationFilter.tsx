import { Input, Space, Tag, theme } from "antd";
import type { NotificationType } from "../schemas/notification";

interface NotificationFilterProps {
  activeTypes: Set<NotificationType>;
  onToggleType: (type: NotificationType) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

const TYPES: NotificationType[] = ["info", "warning", "error", "success"];

const LABELS: Record<NotificationType, string> = {
  info: "Info",
  warning: "Warning",
  error: "Error",
  success: "Success",
};

export function NotificationFilter({
  activeTypes,
  onToggleType,
  search,
  onSearchChange,
}: NotificationFilterProps) {
  const { token } = theme.useToken();

  const colors: Record<NotificationType, string> = {
    info: token.colorInfo,
    success: token.colorSuccess,
    warning: token.colorWarning,
    error: token.colorError,
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <Space wrap>
        {TYPES.map((type) => (
          <Tag.CheckableTag
            key={type}
            checked={activeTypes.has(type)}
            onChange={() => onToggleType(type)}
            style={{
              borderColor: colors[type],
              color: activeTypes.has(type) ? "#fff" : colors[type],
              backgroundColor: activeTypes.has(type) ? colors[type] : "transparent",
            }}
          >
            {LABELS[type]}
          </Tag.CheckableTag>
        ))}
      </Space>
      <Input.Search
        allowClear
        placeholder="Search notifications…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Space>
  );
}
