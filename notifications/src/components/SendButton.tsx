import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import styled from "styled-components";

const StyledButton = styled(Button)`
  flex-shrink: 0;
`;

interface SendButtonProps {
  onClick: () => void;
}

export function SendButton({ onClick }: SendButtonProps) {
  return (
    <StyledButton type="primary" icon={<EditOutlined />} onClick={onClick}>
      Send message
    </StyledButton>
  );
}
