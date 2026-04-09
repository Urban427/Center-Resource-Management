import { theme } from "../theme";
import { DeviceStatus } from "../types/device";
import type { User as UserType } from "../types/users";
import { QrCode, Inbox, Activity, Eye, Warehouse, Sun, Moon, User, PackageCheck , Truck  } from "lucide-react";
import { LanguageButton } from "./LanguageButton";
import DeviceEditForm from "../components/Device/DeviceEditForm";
import { useState } from "react";
import "country-flag-icons/react/3x2";
import { useTranslation } from "react-i18next";

type ToolButtonProps = {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
};

function ToolButton({ icon, title, onClick }: ToolButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        border: "none",
        background: "transparent",
        color: theme.colors.buttonText,
        padding: theme.spacing.small,
        display: "flex",
        alignItems: "center",
        outline: "none",
        justifyContent: "center",
        cursor: "pointer",
        borderRadius: theme.borderRadius,
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = theme.colors.hover)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
    >
      {icon}
    </button>
  );
}









const RUFlag = () => (
  <svg width="24" height="24" viewBox="0 0 3 2">
    <rect width="3" height="2" fill="white" />
    <rect width="3" height="1.33" y="0.66" fill="#0039A6" />
    <rect width="3" height="0.66" y="1.33" fill="#D52B1E" />
  </svg>
);

type TopBarProps = {
  user: UserType;
  onLogout?: () => void;
  onSwitchToDevices?: () => void;
  onSwitchToUsers?: () => void;
  onToggleSidebar?: () => void;
  onOpenModal?: (status: DeviceStatus) => void;
  isDarkTheme?: boolean;
  onToggleTheme?: () => void;
};

export default function TopBar({ user, onLogout, onSwitchToDevices, onSwitchToUsers, onToggleSidebar, onOpenModal, isDarkTheme, onToggleTheme }: TopBarProps) {
  const [update, setUpdate] = useState<boolean>(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [language, setLanguage] = useState<{ code: string }>(() => {
    const saved = localStorage.getItem("lang");
    return saved ? JSON.parse(saved) : { code: "US" };
  });
  const { t } = useTranslation();

  return (
    <>
    <div
      style={{
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${theme.spacing.large}px`,
        backgroundColor: theme.colors.primary,
        color: theme.colors.buttonText,
      }}
    >
      {/* Left: App name + sidebar toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.small }}>
        <button
          onClick={onToggleSidebar}
          style={{
            border: "none",
            background: "transparent",
            color: theme.colors.buttonText,
            fontSize: 16,
            cursor: "pointer",
            outline: "none",
            padding: theme.spacing.tiny || 2,
            borderRadius: theme.borderRadius,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
          title="Toggle sidebar"
        >
          ☰
        </button>

        <button
          onClick={onSwitchToDevices}
          style={{
            border: "none",
            background: "transparent",
            color: theme.colors.buttonText,
            fontWeight: "bold",
            fontSize: 18,
            cursor: "pointer",
            outline: "none",
            padding: theme.spacing.small,
            borderRadius: theme.borderRadius,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = theme.colors.hover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          {t("appName")}
        </button>

        {/* Task buttons right next to CRM */}
        <ToolButton
          icon={<QrCode size={20} />}
          title={t("qrAnalyzer")}
          onClick={() => setUpdate(true)}
        />
        <ToolButton
          icon={<Inbox size={20} />}
          title={t("registration")}
          onClick={() => onOpenModal?.(DeviceStatus.Registered)}
        />
        <ToolButton
          icon={<Activity size={20} />}
          title={t("test")}
          onClick={() => onOpenModal?.(DeviceStatus.Testing)}
        />
        <ToolButton
          icon={<Eye size={20} />}
          title={t("visualTest")}
          onClick={() => onOpenModal?.(DeviceStatus.VisualTesting)}
        />
        <ToolButton
          icon={<PackageCheck  size={20} />}
          title={t("release")}
          onClick={() => onOpenModal?.(DeviceStatus.Released)}
        />
        <ToolButton
          icon={<Warehouse size={20} />}
          title={t("warehouse")}
          onClick={() => onOpenModal?.(DeviceStatus.InWarehouse)}
        />
        <ToolButton
          icon={<Truck size={20} />}
          title={t("sentOut")}
          onClick={() => onOpenModal?.(DeviceStatus.SentToCustomer)}
        />
      </div>
      {/* Right: theme / account / language */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.small,
        }}
      >
        <LanguageButton
          code={language.code}
          languages={[
            { code: "US" },
            { code: "DE" },
            { code: "RU"},
          ]}
          onSelect={(lang) => {
            setLanguage(lang);
            localStorage.setItem("lang", JSON.stringify(lang));
          }}
        />
        {/* <LanguageButton code="FR" flag={<FlagIcon code="FR" size={24} />} /> */}

        
        <ToolButton
          icon={
            isDarkTheme ? <Sun size={18} /> : <Moon size={18} />
          }
          title={t("Theme")}
          onClick={onToggleTheme}
        />

       <div style={{ position: "relative" }}>
        <ToolButton
          icon={<User size={18} />}
          title={t("account")}
          onClick={() => setShowUserModal((prev) => !prev)}
        />

        {showUserModal && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: 6,
              background: "#fff",
              color: "#000",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              padding: 12,
              minWidth: 180,
              zIndex: 1000,
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <strong>{user?.name}</strong>
            </div>

            <div style={{ fontSize: 13, opacity: 0.6 }}>
              email: {user?.email}
            </div>

            <div style={{ fontSize: 13, opacity: 0.6 }}>
              role: {user?.roleName}
            </div>

            <hr style={{ margin: "10px 0" }} />

            <div
              style={{ cursor: "pointer", padding: 6 }}
              onClick={() => {
                onSwitchToUsers?.();
                setShowUserModal(false);
              }}
            >
              Profile
            </div>

            <div 
              style={{ cursor: "pointer", padding: 6 }}
              onClick={() => {
                onLogout?.();
                setShowUserModal(false);
              }}
            >
              Logout
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
    {update && <DeviceEditForm title={"Search Device"} device={null} onClose={() => setUpdate(false)} />}
    </>
  );
}
