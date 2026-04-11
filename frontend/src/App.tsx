import { useEffect, useState } from "react";
import Sidebar from "./layout/Sidebar";
import TopBar from "./layout/TopBar";
import Login from "./layout/Login";
import DeviceSelector from "./components/Device/DeviceComponent";
import DeviceTypePanel from "./components/DeviceType/DeviceTypeComponent";
import { theme } from "./theme";
import BookingComponent from "./components/Booking/BookingComponent";
import DeviceTestForm from "./components/Tests/TestForm";
import TestComponent from "./components/Tests/TestComponent";
import TrashComponent from "./components/Trash/TrashComponent";
import { Dashboard } from "./components/DashBoard/Dashboard";
import UsersComponent from "./components/Users/UsersComponent"
import { DeviceStatus } from "./types/device";

type View = "device" | "deviceType" | "tests" | "trash" | "booking" | "dashboard" | "users";

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [status, setStatus] = useState<DeviceStatus>(DeviceStatus.Testing);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("accessToken"));
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const getSystemTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDarkTheme, setIsDarkTheme] = useState(getSystemTheme);
  const [showTestModal, setShowTestModal] = useState(false);

  const handleToggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  useEffect(() => {
    const handler = () => {
      setIsAuth(false);
    };

    window.addEventListener("unauthorized", handler);
    return () => window.removeEventListener("unauthorized", handler);
  }, []);

  if (!isAuth) {
    return <Login
      onLogin={(user) => {
        setUser(user);
        setIsAuth(true);
      }}
    />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* -------- TOP BAR -------- */}
      <TopBar
        user={user}
        onLogout={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          setUser(null);
          setIsAuth(false);
        }}
        onSwitchToDevices={() => setView("dashboard")}
        onSwitchToUsers={() => setView("users")}
        onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
        onOpenModal={(status: DeviceStatus) => {
          setStatus(status);
          setShowTestModal(true);
        }}
        onToggleTheme={handleToggleTheme}
        isDarkTheme={isDarkTheme}
      />

      {/* -------- BODY -------- */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Sidebar
          view={view}
          setView={setView}
          collapsed={sidebarCollapsed}
          toggle={() => setSidebarCollapsed((v) => !v)}
        />

        <div
          style={{
            flex: 1,
            padding: theme.spacing.large,
            minHeight: 0,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {view === "dashboard" && <Dashboard />}
          {view === "device" && <DeviceSelector />}
          {view === "deviceType" && <DeviceTypePanel />}
          {view === "booking" && <BookingComponent />}
          {view === "tests" && <TestComponent />}
          {view === "trash" && <TrashComponent />}
          {view === "users" && <UsersComponent />}
        </div>
      </div>

      {showTestModal && (
        <DeviceTestForm
          onClose={() => setShowTestModal(false)}
          currentStage={status}
          setCurrentStage={(stage) => setStatus(stage)}
        />
      )}
    </div>
  );
}