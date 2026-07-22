import { useCallback, useEffect, useRef, useState } from "react";
import { notificationSchema, type Notification } from "../schemas/notification";

const WS_URL = "ws://localhost:8080";
const MAX_NOTIFICATIONS = 100;
const INITIAL_RECONNECT_DELAY = 1000; // 1s
const MAX_RECONNECT_DELAY = 30000; // 30s

export type ConnectionState = "connecting" | "connected" | "reconnecting";

export interface ConnectionStatus {
  state: ConnectionState;
  /** Reconnect attempts made since the last successful connection (0 while connected). */
  attempt: number;
}

export interface UseNotificationsResult {
  notifications: Notification[];
  status: ConnectionStatus;
  /**
   * Sends a text message to the server over the live socket. Returns true if
   * the message was handed off to an open socket, false if there was no open
   * connection to send it on.
   */
  sendMessage: (text: string) => boolean;
}

/**
 * Connects to the notification WebSocket and keeps the most recent
 * MAX_NOTIFICATIONS notifications (newest first) in state.
 *
 * If the connection drops it reconnects automatically with exponential
 * backoff, and reports the live connection status so the UI can reflect it.
 * Messages resume flowing on a fresh socket without a page refresh.
 */
export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>({
    state: "connecting",
    attempt: 0,
  });
  // Holds the currently open socket (or null) so sendMessage can reach it
  // without re-running the connection effect on every send.
  const socketRef = useRef<WebSocket | null>(null);

  const sendMessage = useCallback((text: string): boolean => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(text);
    return true;
  }, []);

  useEffect(() => {
    let disposed = false;
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    // Reconnect attempts since the last open; reset to 0 on a successful open.
    let attempt = 0;

    const scheduleReconnect = () => {
      if (disposed) return;
      attempt += 1;
      // Exponential backoff, capped, so a downed server isn't hammered.
      const delay = Math.min(
        INITIAL_RECONNECT_DELAY * 2 ** (attempt - 1),
        MAX_RECONNECT_DELAY,
      );
      setStatus({ state: "reconnecting", attempt });
      reconnectTimer = setTimeout(connect, delay);
    };

    const connect = () => {
      if (disposed) return;
      // First attempt shows "connecting"; retries keep the "reconnecting"
      // status already set by scheduleReconnect.
      if (attempt === 0) {
        setStatus({ state: "connecting", attempt: 0 });
      }

      const socket = new WebSocket(WS_URL);
      ws = socket;

      socket.onopen = () => {
        if (disposed) return;
        attempt = 0;
        socketRef.current = socket;
        setStatus({ state: "connected", attempt: 0 });
      };

      socket.onmessage = (event) => {
        let raw: unknown;
        try {
          raw = JSON.parse(event.data);
        } catch (err) {
          console.warn("Discarding non-JSON notification message", err);
          return;
        }

        const result = notificationSchema.safeParse(raw);
        if (!result.success) {
          console.warn("Discarding malformed notification", result.error);
          return;
        }

        // Functional update avoids stale closures; prepend newest, cap the list.
        setNotifications((prev) =>
          [result.data, ...prev].slice(0, MAX_NOTIFICATIONS),
        );
      };

      socket.onclose = () => {
        if (disposed || ws !== socket) return;
        ws = null;
        if (socketRef.current === socket) socketRef.current = null;
        // A drop (or a failed connect) always ends here — retry from one place.
        scheduleReconnect();
      };

      socket.onerror = () => {
        // Errors are always followed by a close event, where reconnection is
        // handled. Close proactively and keep the console quiet.
        socket.close();
      };
    };

    connect();

    return () => {
      disposed = true;
      socketRef.current = null;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        // Detach handlers so this cleanup-driven close doesn't schedule a
        // reconnect, then close (works whether OPEN or still CONNECTING —
        // e.g. React StrictMode's dev double-mount).
        ws.onopen = null;
        ws.onmessage = null;
        ws.onclose = null;
        ws.onerror = null;
        ws.close();
      }
    };
  }, []);

  return { notifications, status, sendMessage };
}
