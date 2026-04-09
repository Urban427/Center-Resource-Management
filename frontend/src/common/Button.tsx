import { theme } from "../theme";

type Props = {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
};

export default function Button({ onClick, children, disabled, loading, style }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: theme.colors.buttonBg,
        color: theme.colors.buttonText,
        padding: theme.spacing.small,
        border: "none",
        outline: "none",
        borderRadius: theme.borderRadius,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {loading ? "Saving…" : children}
    </button>
  );
}
