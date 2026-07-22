import { Badge, Space, Spin, Typography, theme } from "antd";
import type { ConnectionStatus as ConnectionStatusValue } from "../hooks/useNotifications";

interface ConnectionStatusProps {
  status: ConnectionStatusValue;
}

/**
 * Compact live WebSocket connection indicator, sized for the top nav bar: a
 * subtle badge while connected, and a spinner with the retry attempt count
 * while connecting or reconnecting.
 */
export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const { token } = theme.useToken();

  if (status.state === "connected") {
    return <Badge status="success" text="Connected" />;
  }

  const reconnecting = status.state === "reconnecting";
  const label = reconnecting
    ? `Reconnecting… (attempt ${status.attempt})`
    : "Connecting…";

  return (
    <Space size="small">
      <Spin size="small" />
      <Typography.Text
        style={{ color: reconnecting ? token.colorWarning : undefined }}
      >
        {label}
      </Typography.Text>
    </Space>
  );
}
