import { theme} from "../theme";

type PaginationButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export function PaginationButton({ onClick, disabled, children }: PaginationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: `${theme.spacing.small}px ${theme.spacing.medium}px`,
        borderRadius: theme.borderRadius,
        border: "none",
        outline: "none",
        backgroundColor: disabled ? "#ccc" : theme.colors.buttonBg,
        color: theme.colors.buttonText,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.2s",
      }}
      onMouseOver={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.colors.buttonHoverBg;
      }}
      onMouseOut={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.colors.buttonBg;
      }}
    >
      {children}
    </button>
  );
}
