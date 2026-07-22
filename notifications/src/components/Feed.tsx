import { useMemo, useState } from "react";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { Notification, NotificationType } from "../schemas/notification";
import { NotificationFilter } from "./NotificationFilter";
import { NotificationList } from "./NotificationList";
import { SendMessageDialog } from "./SendMessageDialog";

const ALL_TYPES: NotificationType[] = ["info", "warning", "error", "success"];

interface FeedProps {
  notifications: Notification[];
  /** Sends a text message to the server; returns false if disconnected. */
  sendMessage: (text: string) => boolean;
}

export function Feed({ notifications, sendMessage }: FeedProps) {
  const [activeTypes, setActiveTypes] = useState<Set<NotificationType>>(
    () => new Set(ALL_TYPES),
  );
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleType = (type: NotificationType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notifications.filter((n) => {
      if (!activeTypes.has(n.type)) return false;
      if (query && !n.text.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [notifications, activeTypes, search]);

  return (
    <div className="feed">
      <div className="feed-toolbar">
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setDialogOpen(true)}
        >
          Send message
        </Button>
      </div>
      <NotificationFilter
        activeTypes={activeTypes}
        onToggleType={toggleType}
        search={search}
        onSearchChange={setSearch}
      />
      <NotificationList
        notifications={filtered}
        hasReceivedAny={notifications.length > 0}
      />
      <SendMessageDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSend={sendMessage}
      />
    </div>
  );
}
