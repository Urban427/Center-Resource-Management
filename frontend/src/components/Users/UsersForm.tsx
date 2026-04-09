import { useState } from "react";
import { ModalWindow } from "../../common/ModalWindow";
import { InputField } from "../../common/InputField";
import { theme } from "../../theme";
import type { User } from "../../types/users";

export type UsersFormProps = {
  onClose: () => void;
  onSave: (user: User) => Promise<void>;
};

export default function UsersForm({ onClose, onSave }: UsersFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [roleId, setRoleId] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // ✅ Валидация
    if (!name || !email || !role || !roleId) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user: User = {
        id: 0, // сервер создаст
        name,
        email,
        roleName: role,
        roleId: Number(roleId),
      };

      await onSave(user);

      onClose();

      // очистка формы
      setName("");
      setEmail("");
      setRole("");
      setRoleId("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={theme.styles.error}>⚠ {error}</div>}

      <ModalWindow
        title="Create User"
        onClose={onClose}
        width="40%"
        height="60%"
        closeOnOverlay={false}
      >
        <div style={theme.styles.bodyLeft}>
          <InputField
            label="Name"
            placeholder="Enter name"
            value={name}
            onChange={setName}
            rows={1}
          />

          <InputField
            label="Email"
            placeholder="Enter email"
            value={email}
            onChange={setEmail}
            rows={1}
          />

          <InputField
            label="Role"
            placeholder="Enter role (e.g. Admin)"
            value={role}
            onChange={setRole}
            rows={1}
          />

          <InputField
            label="Role ID"
            placeholder="Enter role ID"
            value={roleId}
            onChange={setRoleId}
            rows={1}
          />

          {/* Save */}
          <button
            disabled={loading}
            onClick={handleSubmit}
            style={{
              marginTop: 24,
              width: "100%",
              padding: 14,
              background: theme.colors.primary,
              color: theme.colors.background,
              fontWeight: "bold",
              outline: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </ModalWindow>
    </div>
  );
}