import { ConfigProvider, Layout, theme, Typography } from "antd";
import { Feed } from "./components/Feed";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { useNotifications } from "./hooks/useNotifications";
import "./App.css";

function AppContent() {
	const { notifications, status, sendMessage } = useNotifications();

	return (
		<Layout className="app-layout">
			<Layout.Header className="app-header">
				<Typography.Title level={3} style={{ margin: 0, color: "#ffffff" }}>
					Live Notifications
				</Typography.Title>
				<ConnectionStatus status={status} />
			</Layout.Header>
			<Layout.Content className="app-content">
				<Feed notifications={notifications} sendMessage={sendMessage} />
			</Layout.Content>
		</Layout>
	);
}

function App() {
	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
				token: { colorBgLayout: "#242424" },
			}}
		>
			<AppContent />
		</ConfigProvider>
	);
}

export default App;
