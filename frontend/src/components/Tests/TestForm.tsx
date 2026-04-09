import React, { useRef, useState } from "react";
import { theme } from "../../theme";
import type { Device, DeviceStatusHistory } from "../../types/device";
import { ResultCard } from "../../common/ResultCard";
import { DeviceStatus, StageResult, formatStatus, formatStatusText } from "../../types/device";
import  DeviceLifecycleDiagram from "./DeviceLifecycleDiagram";
import { Pin, SearchIcon} from "lucide-react"; 
import { ModalWindow } from "../../common/ModalWindow";
import { apiFetch } from "../../api/apiFetch";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  onClose: () => void;
  currentStage: DeviceStatus;
  setCurrentStage: (stage: DeviceStatus) => void;
};

/* ======================= COMPONENT ======================= */
export default function DeviceTestForm({ onClose, currentStage, setCurrentStage }: Props) {
  const [deviceId, setDeviceId] = useState("");
  const [comment, setComment] = useState("");
  const [deviceChecked, setDeviceChecked] = useState<number>(0);
  const [result, setResult] = useState<StageResult>(StageResult.Passed);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveSearchBarAfterSave, setSaveSearchBarAfterSave] = useState(false);
  const [saveCommentAfterSave, setSaveCommentAfterSave] = useState(false);
  const [autoSaveAfterScan, setAutoSaveAfterScan] = useState(false);
  const [history, setHistory] = useState<DeviceStatusHistory[]>([]);
  const { t } = useTranslation();

  const deviceRef = useRef<HTMLInputElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const isTestStage =
    currentStage === DeviceStatus.Testing ||
    currentStage === DeviceStatus.VisualTesting;

  const effectiveResult = isTestStage ? result : StageResult.Passed;


  const loadDevice = async (id: string) => {
    try {
      const res = await apiFetch(`/api/device/${id}`);
      if (!res.ok) throw new Error("Device not found");

      const info: Device = await res.json();
      setDeviceChecked(info.checked); 
      setError(null);

      // If auto-save is ON, trigger save immediately after loading device
      if (autoSaveAfterScan) {
        await saveTest();
        // Optionally clear fields if toggles are set
        if (!saveSearchBarAfterSave) setDeviceId("");
        if (!saveCommentAfterSave) setComment("");
      }
    } catch (e: any) {
      setDeviceChecked(0);
      setError(e.message);
    }
  };

  const saveTest = async () => {
    if (!deviceId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(
        `/api/history/${deviceId}/record?status=${currentStage}&result=${effectiveResult}&Comment=${encodeURIComponent(comment)}`,
        { method: "POST" }
      );

      if (!res.ok) {
        let errMsg = "Failed to save test";
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch {}
        throw new Error(errMsg);
      }

      const newTest: DeviceStatusHistory = await res.json();
      setDeviceChecked(newTest.newChecked);
      setHistory([newTest, ...history]);

      // Clear fields based on toggles
      if (!saveSearchBarAfterSave) setDeviceId("");
      if (!saveCommentAfterSave) setComment("");

    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };




  return (
    <>
      {error && (<div style={theme.styles.error}>⚠ {error} </div>)}
      <ModalWindow title={formatStatus(currentStage, 223, t)} onClose={onClose} width="70%" height="70vh">
          {/* Main Body */}
          <div style={theme.styles.body}> 
            {/* Left Panel */}
            <div style={theme.styles.bodyLeft}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {/* search bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: SearchBarStyle.border,
                    borderRadius: SearchBarStyle.borderRadius,
                    overflow: "hidden",
                    backgroundColor: SearchBarStyle.backgroundColor,
                    width: "100%",
                  }}
                >
                  {/* Pin Button */}
                  <div
                    title="Save Search Bar after saving" 
                    style={{
                      height:"100%", padding: "0 12px", alignItems: "center", justifyContent: "center", cursor: "pointer",
                      backgroundColor: saveSearchBarAfterSave ? theme.colors.buttonBg: "transparent",
                    }}
                    onClick={() => { setSaveSearchBarAfterSave(!saveSearchBarAfterSave); }}
                  >
                    <Pin  style={{
                      height:"100%", alignItems: "center", justifyContent: "center", cursor: "pointer", color: theme.colors.overlay,
                    }}
                    size={20}  />
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      width: 1,
                      backgroundColor: "#ccc",
                      alignItems: "stretch",
                      height: "100%",
                    }}
                  />

                  {/* Input Field */}
                  <input
                    ref={deviceRef}
                    value={deviceId}
                    placeholder={t("scanDeviceId")}
                    onChange={(e) => setDeviceId(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") loadDevice(deviceId); }}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      padding: "10px 12px",
                      fontSize: 16,
                      backgroundColor: "transparent",
                      color: SearchBarStyle.color,
                    }}
                  />

                  
                  {/* Divider */}
                  <div
                    style={{
                      width: 1,
                      backgroundColor: "#ccc",
                      alignItems: "stretch",
                      height: "100%",
                    }}
                  />
                  
                  <div 
                    title="Auto save after entering ID" 
                    style={{
                      height:"100%", padding: "0 12px", alignItems: "center", justifyContent: "center", cursor: "pointer", color: theme.colors.overlay,
                      backgroundColor: autoSaveAfterScan ? theme.colors.buttonBg : "transparent",
                    }}
                    onClick={() => { setAutoSaveAfterScan(!autoSaveAfterScan); }}
                  >
                    <SearchIcon  style={{
                      height:"100%", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    }}
                    size={20}/>
                  </div>
                </div>
                
                {/* commentary bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: SearchBarStyle.border,
                    borderRadius: SearchBarStyle.borderRadius,
                    overflow: "hidden",
                    backgroundColor: SearchBarStyle.backgroundColor,
                    width: "100%",
                  }}
                >
                  {/* Pin Button */}
                  <div 
                    title="Save Comment after saving" 
                    style={{
                      height:"100%", padding: "0 12px", alignItems: "center", justifyContent: "center", cursor: "pointer",
                      backgroundColor: saveCommentAfterSave ? theme.colors.buttonBg: "transparent",
                    }}
                    onClick={() => { setSaveCommentAfterSave(!saveCommentAfterSave); }}
                  >
                    <Pin  style={{
                      height:"100%", alignItems: "center", justifyContent: "center", cursor: "pointer", color: theme.colors.overlay,
                    }}
                    size={20} />
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      width: 1,
                      backgroundColor: "#ccc",
                      alignItems: "stretch",
                      height: "100%",  // slightly shorter than input for style
                    }}
                  />

                  {/* Input Field */}
                  <textarea
                    ref={commentRef}
                    value={comment}
                    placeholder={t("comment") + " (" + t("optional") + ")"}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ ...SearchBarStyle, height: "80px", padding: "10px", resize: "none", flex: 1, border: "none", }}
                  />
                </div>
                
                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              </div>
            </div>
            {/* Lifecycle */}
            {deviceChecked !== null && (
              <>
                <DeviceLifecycleDiagram status={currentStage} deviceChecked={deviceChecked} setCurrent={setCurrentStage} />
                {/* Result */}
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  {/* PASSED */}
                  <button
                    onClick={() => setResult(StageResult.Passed)}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: 10,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.2s ease",
                      
                      background:
                        effectiveResult === StageResult.Passed ? "#1abb65" : "#bdf9d7",
                      color:
                        effectiveResult === StageResult.Passed ? theme.colors.background : "#2ecc71",
                      boxShadow:
                        effectiveResult === StageResult.Passed
                          ? "0 6px 14px rgba(46, 204, 113, 0.4)"
                          : "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Check strokeWidth={3} size={20} style={{ verticalAlign: "middle" }} /> {t("Passed")}
                  </button>

                  {/* FAILED — only for test stages */}
                  {(  currentStage === DeviceStatus.Testing || currentStage === DeviceStatus.VisualTesting) && (
                    <button
                      onClick={() => setResult(StageResult.Failed)}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: 10,
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        outline: "none",
                        transition: "all 0.2s ease",
                        background:
                          effectiveResult === StageResult.Failed ? "#e74c3c" : "#ffd8d38b",
                        color:
                          effectiveResult === StageResult.Failed ? theme.colors.background : "#e74c3c",
                        boxShadow:
                          effectiveResult === StageResult.Failed
                            ? "0 6px 14px rgba(231, 76, 60, 0.4)"
                            : "0 2px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      <X strokeWidth={3} size={20} style={{ verticalAlign: "middle" }} /> {t("Failed")}
                    </button>
                  )}
                </div>


                {/* Save */}
                <button
                  disabled={loading}
                  onClick={saveTest}
                  style={{
                    marginTop: 24,
                    width: "100%",
                    padding: 14,
                    background: theme.colors.primary,
                    color: theme.colors.background,
                    fontWeight: "bold",
                  }}
                >
                  {t("save")} {loading && "..."}
                </button>
              </>
            )}
          </div>

            {/* Right Panel: History */}
            <div
              style={{
                flex: 1,
                padding: theme.spacing.large,
                background: theme.colors.rowAltBg,
                overflowY: "auto",
              }}
            >
              {history.length === 0 ? (
                <div style={{ color: theme.colors.textMuted }}>{t("noTestsYet")}</div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.small,
                  }}
                >
                  {history.map((item, index) => (
                    <ResultCard 
                      //result={item.newStageResult} 
                      result={index === 0 ? StageResult.Wait : item.newStageResult}
                      id={item.deviceId} 
                      status={item.newStatus}
                      comment={item.comment}
                      onClick={()=> {
                          setDeviceId(item.deviceId);
                          loadDevice(item.deviceId);
                          setComment(item.comment);
                          setResult(item.newStageResult);
                          setCurrentStage(item.newStatus);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
      </ModalWindow>
    </>
  );
}

const SearchBarStyle: React.CSSProperties = {
  padding: `${theme.spacing.small}px ${theme.spacing.medium}px`,
  borderRadius: theme.borderRadius,
  border: theme.border,
  backgroundColor: theme.colors.background,
  color: theme.colors.text,
  fontSize: 16,
  outline: "none",
  transition: "0.2s",
  minWidth: 250,
};