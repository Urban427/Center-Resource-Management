import { theme } from "../theme";
import React, { useState } from "react";
import { RU, US, DE } from "country-flag-icons/react/3x2";
import { useTranslation } from "react-i18next";

type Language = {
  code: string;
};

type LanguageButtonProps = {
  code: string;
  languages: Language[];
  onSelect?: (lang: Language) => void;
};

const flagMap: Record<string, React.ReactNode> = {
  RU: <RU />,
  US: <US />,
  DE: <DE />,
};

function FlagCircle({ code }: { code: string }) {
  const Flag = flagMap[code];

  return (
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.2)",
        boxShadow:
          "0 2px 6px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.6)",
      }}
    >
      {Flag ? (
        <div
          style={{
            width: "140%",
            height: "140%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "scale(1.5)",
          }}
        >
          {Flag}
        </div>
      ) : (
        <span style={{ fontSize: 10, opacity: 0.6 }}>?</span>
      )}
    </div>
  );
}

export function LanguageButton({
  code,
  languages,
  onSelect,
}: LanguageButtonProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        title={t("language")}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: `${theme.spacing.tiny}px ${theme.spacing.small}px`,
          border: "none",
          borderRadius: theme.borderRadius * 2,
          background: "rgba(255, 255, 255, 0.0)",
          color: theme.colors.buttonText,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          outline: "none",
          transition: "all 0.2s ease-in-out",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.0)";
        }}
      >
        <FlagCircle code={code} />
        <span>{code}</span>
      </button>

      {/* Dropdown */}
      {open && (
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
            padding: 8,
            minWidth: 160,
            zIndex: 1000,
          }}
        >
          {languages.map((lang) => (
            <div
              key={lang.code}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: 6,
                cursor: "pointer",
                borderRadius: 6,
              }}
              onClick={() => {
                onSelect?.(lang);
                setOpen(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(0,0,0,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <FlagCircle code={lang.code} />
              <span>{lang.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}