import { Input, Space, Tag, theme } from "antd";
import type { ReactNode } from "react";
import styled from "styled-components";
import type { NotificationType } from "../schemas/notification";

interface NotificationFilterProps {
  activeTypes: Set<NotificationType>;
  onToggleType: (type: NotificationType) => void;
  search: string;
  onSearchChange: (search: string) => void;
  /** Optional action rendered right-aligned on the filter-toggles row. */
  action?: ReactNode;
}

const TogglesRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

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
  action,
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
      <TogglesRow>
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
        {action}
      </TogglesRow>
      <Input.Search
        allowClear
        placeholder="Search notifications…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Space>
  );
}
