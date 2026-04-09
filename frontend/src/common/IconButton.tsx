import { theme } from "../theme";

type Props = {
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
  danger?: boolean;
};

export default function IconButton({ onClick, title, children, danger }: Props) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: "none",
        outline: "none",
        border: "none",
        cursor: "pointer",
        padding: theme.spacing.small,
        color: danger ? theme.colors.error : theme.colors.text,
      }}
    >
      {children}
    </button>
  );
}
