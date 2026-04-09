const colors = {
    primary: "#646cff",

    background: "#ffffff",
    modalBackground: "#ffffff",
    overlay: "rgba(0, 0, 0, 0.5)",

    tableHeaderBg: "#f2f2f2",
    tableHeaderText: "#000000",
    tableBodyText: "#000000",

    text: "#000000",
    textMuted: "#777",

    // ✅ Error semantics
    error: "#ff4d4f",
    errorBg: "rgba(255, 77, 79, 0.08)",
    errorBorder: "rgba(255, 77, 79, 0.3)",

    // ✅ Loading / disabled
    loadingOverlay: "rgba(255,255,255,0.6)",
    disabled: "#bbb",

    buttonBg: "#646cff",
    buttonText: "#ffffff",
    buttonHoverBg: "#4a50cc",

    rowAltBg: "rgba(0,0,0,0.02)",
    rowHoverBg: "rgba(0,0,0,0.05)",
    hover: "rgba(255,255,255,0.1)",
};

const spacing = {
    tiny: 2,
    small: 5,
    medium: 10,
    large: 20,
};

export const theme = {
  colors,
  spacing,
  borderRadius: 8,
  border: "1px solid #ddd",
  
  styles: {
    overlay: {
      position: "fixed" as const,
      inset: 0,
      background: colors.overlay,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    window: {
      background: colors.modalBackground,
      position: "fixed" as const,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "80%",
      height: "70vh",
      display: "flex",
      flexDirection: "column" as const,
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `${spacing.medium}px ${spacing.large}px`,
      background: colors.primary,
    },
    topBarButton: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: 6,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.2s",
    },
    body: {
      background: "#f7f8fa",
      width: "100%",
      display: "flex",
      overflow: "hidden",
    },
    bodyLeft: {
      flex: 1,
      padding: spacing.large,
      display: "flex",
      flexDirection: "column" as const,
      boxShadow: "0 6px 5px rgba(0,0,0,0.2)",
    },
    error: {
      position: "fixed" as const,
      bottom: 20, 
      left: 20, 
      transform: "none",
      padding: "10px 16px",
      backgroundColor: "#e74c3c",
      background: "linear-gradient(135deg, #e74c3c, #c0392b)",
      boxShadow: "0 6px 20px rgba(231, 76, 60, 0.5), 0 0 10px rgba(255, 100, 100, 0.3)",
      color: "#fff",
      borderRadius: 6,
      zIndex: 2000,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
  }
}