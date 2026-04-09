import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { theme } from "../../theme";
import { apiFetch } from "../../api/apiFetch";

type DashboardData = {
  totalDevices: number;
  totalBookings: number;
  totalDeviceTypes: number;
  totalTests: number;
  totalDeleted: number;

  devicesByType: { name: string; count: number }[];
  bookingsByType: { name: string; count: number }[];
  deletedByEntity: { name: string; count: number }[];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#E74C3C"];

export const Dashboard = () => {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch dashboard data on mount
  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch("/api/dashboard");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const json: DashboardData = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: theme.spacing.large }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: theme.spacing.large, color: theme.colors.error }}>{error}</div>;
  if (!data) return <div style={{ padding: theme.spacing.large }}>No data available</div>;

  return (
    <div style={{ padding: theme.spacing.large, background: theme.colors.background, color: theme.colors.text }}>
      {/* <h1 style={{ marginBottom: theme.spacing.large }}>Dashboard</h1> */}

      {/* Tiles */}
      <div style={{ display: "flex", gap: theme.spacing.medium, flexWrap: "wrap", marginBottom: theme.spacing.large }}>
        {[
          { label: "Total Devices", value: data.totalDevices },
          { label: "Total Bookings", value: data.totalBookings },
          { label: "Total Device Types", value: data.totalDeviceTypes },
          { label: "Total Tests", value: data.totalTests },
          { label: "Deleted Entities", value: data.totalDeleted },
        ].map((tile, idx) => (
          <div
            key={idx}
            style={{
              flex: "1 1 180px",
              background: theme.colors.rowAltBg,
              borderRadius: theme.borderRadius,
              padding: theme.spacing.medium,
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: theme.spacing.small }}>{tile.label}</h3>
            <p style={{ fontSize: 24, fontWeight: "bold" }}>{tile.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "flex", gap: theme.spacing.large, flexWrap: "wrap" }}>
        {/* Devices Pie */}
        <div style={{ flex: "1 1 290px", height: 300 }}>
          <h3>Devices by Type</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.devicesByType.map((d) => ({ name: d.name, value: d.count }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.devicesByType.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Bar */}
        <div style={{ flex: "1 1 400px", height: 300 }}>
          <h3>Bookings per Device Type</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.bookingsByType.map((b) => ({ name: b.name, count: b.count }))}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={theme.colors.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Deleted Pie */}
        <div style={{ flex: "1 1 400px", height: 300 }}>
          <h3>Deleted Entities</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.deletedByEntity.map((d) => ({ name: d.name, value: d.count }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.deletedByEntity.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
