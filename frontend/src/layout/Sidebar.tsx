import { theme } from "../theme";
import { Server, Layers, Activity, Trash2, Calendar, LayoutDashboard } from "lucide-react";
import NavButton from "./NavButton";
import { useTranslation } from "react-i18next";

type View = "device" | "deviceType" | "tests" | "trash" | "booking" | "dashboard" | "users";

type SidebarProps = {
  view: View | null;
  setView: (v: View) => void;
  collapsed: boolean;
  toggle: () => void;
};
export default function Sidebar({
  view,
  setView,
  collapsed,
}: SidebarProps) {
  const { t } = useTranslation();
  return (
    <div
      style={{
        width: collapsed ? 30 : 220,
        backgroundColor: theme.colors.tableHeaderBg,
        padding: theme.spacing.medium,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.small,
        transition: "width 0.25s",
      }}
    >
      {/* Navigation buttons */}
      <NavButton
        icon={<LayoutDashboard size={20} />}
        label={t("dashboard")}
        collapsed={collapsed}
        active={view === "dashboard"}
        onClick={() => setView("dashboard")}
      />
      <NavButton
        icon={<Server size={20} />}
        label={t("devices")}
        collapsed={collapsed}
        active={view === "device"}
        onClick={() => setView("device")}
      />
      <NavButton
        icon={<Layers size={20} />}
        label={t("deviceTypes")}
        collapsed={collapsed}
        active={view === "deviceType"}
        onClick={() => setView("deviceType")}
      />
      <NavButton
        icon={<Calendar size={20} />}
        label={t("booking")}
        collapsed={collapsed}
        active={view === "booking"}
        onClick={() => setView("booking")}
      />
      <NavButton
        icon={<Activity size={20} />}
        label={t("tests")}
        collapsed={collapsed}
        active={view === "tests"}
        onClick={() => setView("tests")}
      />
      <NavButton
        icon={<Trash2 size={20} />}
        label={t("trash")}
        collapsed={collapsed}
        active={view === "trash"}
        onClick={() => setView("trash")}
      />
    </div>
  );
}
