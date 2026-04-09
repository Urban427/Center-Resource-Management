import { theme } from "../theme";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 

type InputFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  multiline?: boolean;
  grow?: boolean;
  rows?: number;
  readonly?: boolean;
  secure?: boolean; // new prop
  onChange: (value: string) => void;
  onEnter?: (value: string) => void;
};

export function InputField({
  label,
  value,
  multiline,
  grow,
  readonly,
  rows = 1,
  secure = false,
  onChange,
  onEnter,
}: InputFieldProps) {
  const isEmpty = !value;
  const [show, setShow] = useState(false); // state to toggle visibility

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!multiline && e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter(value);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        flex: grow ? 1 : undefined,
        marginBottom: theme.spacing.medium,
      }}
    >
      {/* Field box */}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows} 
          readOnly={readonly}
          style={{
            width: "100%",
            padding: theme.spacing.small,
            borderRadius: theme.borderRadius,
            border: theme.border,
            resize: "none", 
            background: theme.colors.background,
            color: theme.colors.text,
            fontSize: 14,
            fontFamily: "inherit",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            lineHeight: 1.4,
            overflow: "auto",
            verticalAlign: "top", 
            outline: readonly ? "none" : undefined,
            cursor: readonly ? "default" : "text", 
          }}
        />
      ) : (
        <div style={{ position: "relative" }}>
          <input
            type={secure && !show ? "password" : "text"} // toggle type
            value={value}
            onKeyDown={handleKeyDown}
            onChange={(e) => onChange(e.target.value)}
            
            readOnly={readonly}
            style={{
              width: "100%",
              padding: theme.spacing.small,
              borderRadius: theme.borderRadius,
              border: theme.border,
              background: theme.colors.background,
              color: theme.colors.text,
              fontSize: 14,
              height: 46,
              fontFamily: "inherit",
              outline: readonly ? "none" : undefined,
              cursor: readonly ? "default" : "text", 
            }}
          />
          {secure && (
            <span
              onClick={() => setShow(!show)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: theme.colors.textMuted,
                fontSize: 16,
              userSelect: "none",
              }}
            >
               {show ? <Eye size={18} /> : <EyeOff size={18} />}
            </span>
          )}
        </div>
      )}

      <label
        style={{
          position: "absolute",
          left: 12,
          top: multiline
            ? isEmpty
              ? 4
              : -8
            : isEmpty
              ? 16
              : -8,
          fontSize: multiline
            ? 11
            : isEmpty
              ? 14
              : 11,
          fontWeight: 600,
          color: theme.colors.textMuted,
          background: theme.colors.background,
          padding: "0 4px",
          transition: "all 0.2s ease-out",
          pointerEvents: "none",
          letterSpacing: 0.6,
        }}
      >
        {label}
      </label>
    </div>
  );
}