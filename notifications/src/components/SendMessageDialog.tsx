import { useState } from "react";
import { Input, Modal, message as antdMessage } from "antd";

interface SendMessageDialogProps {
  open: boolean;
  onClose: () => void;
  /** Sends the message; returns false if there was no open connection. */
  onSend: (text: string) => boolean;
}

/**
 * Modal dialog for composing and sending a message to the server. antd's Modal
 * renders the centered dialog over a black transparent overlay for us.
 */
export function SendMessageDialog({
  open,
  onClose,
  onSend,
}: SendMessageDialogProps) {
  const [text, setText] = useState("");
  const [toast, toastContext] = antdMessage.useMessage();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (onSend(trimmed)) {
      setText("");
      onClose();
    } else {
      toast.error("Not connected — message could not be sent.");
    }
  };

  return (
    <Modal
      title="New message"
      open={open}
      onOk={handleSend}
      onCancel={onClose}
      okText="Send"
      okButtonProps={{ disabled: !text.trim() }}
      // Reset the draft once the close animation finishes.
      afterClose={() => setText("")}
      destroyOnClose
    >
      {toastContext}
      <Input.TextArea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message…"
        autoSize={{ minRows: 2, maxRows: 6 }}
        // Send on Enter, newline on Shift+Enter.
        onPressEnter={(e) => {
          if (!e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
    </Modal>
  );
}
