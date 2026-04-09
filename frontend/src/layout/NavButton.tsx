import { theme } from "../theme";

type NavButtonProps = {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
};

export default function NavButton({
  icon,
  label,
  collapsed,
  active,
  onClick,
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        outline: "none",
        padding: theme.spacing.small,
        backgroundColor: active ? theme.colors.primary : "transparent",
        color: active ? theme.colors.buttonText : theme.colors.text,
        border: "none",
        borderRadius: theme.borderRadius,
        cursor: "pointer",
        width: "100%",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
