import { DeviceStatus, DeviceLifecycleFlags, formatStatus } from "../../types/device";
import { useTranslation } from "react-i18next";

const ARROW_OFFSET = 4;

type Props = {
  deviceChecked: number;
  status?: DeviceStatus;
  setCurrent?: (stage: DeviceStatus) => void;
};

type LayoutNode = {
  id: number;
  label: string;
  stage: DeviceStatus;
  col: number;
  row: number;
};

const NODE_W = 90;
const NODE_H = 24;

const COL_GAP = 30;
const ROW_GAP = 5;

const PADDING_X = 10;
const PADDING_Y = 10;

function getNodePosition(col: number, row: number) {
  return {
    x: PADDING_X + col * (NODE_W + COL_GAP),
    y: PADDING_Y + row * (NODE_H + ROW_GAP),
  };
}

const edges = [
  [DeviceStatus.Registered, DeviceStatus.Testing],
  [DeviceStatus.Registered, DeviceStatus.VisualTesting],
  [DeviceStatus.Testing, DeviceStatus.Released],
  [DeviceStatus.VisualTesting, DeviceStatus.Released],
  [DeviceStatus.Released, DeviceStatus.InWarehouse],
  [DeviceStatus.Released, DeviceStatus.SentToCustomer],
  [DeviceStatus.InWarehouse, DeviceStatus.SentToCustomer],
] as const;


export default function DeviceLifecycleDiagram({ deviceChecked, status, setCurrent }: Props) {
  const { t } = useTranslation();

  const layout: LayoutNode[] = [
    {
      id: DeviceStatus.Registered,
      label: formatStatus(DeviceStatus.Registered, 222, t),
      stage: DeviceStatus.Registered,
      col: 0,
      row: 1,
    },
    {
      id: DeviceStatus.Testing,
      label: formatStatus(DeviceStatus.Testing, 222, t),
      stage: DeviceStatus.Testing,
      col: 1,
      row: 0,
    },
    {
      id: DeviceStatus.VisualTesting,
      label: formatStatus(DeviceStatus.VisualTesting, 222, t),
      stage: DeviceStatus.VisualTesting,
      col: 1,
      row: 2,
    },
    {
      id: DeviceStatus.Released,
      label: formatStatus(DeviceStatus.Released, 222, t),
      stage: DeviceStatus.Released,
      col: 2,
      row: 1,
    },
    {
      id: DeviceStatus.InWarehouse,
      label: formatStatus(DeviceStatus.InWarehouse, 222, t),
      stage: DeviceStatus.InWarehouse,
      col: 3,
      row: 0,
    },
    {
      id: DeviceStatus.SentToCustomer,
      label: formatStatus(DeviceStatus.SentToCustomer, 222, t),
      stage: DeviceStatus.SentToCustomer,
      col: 3,
      row: 2,
    },
  ];

  
const nodes = Object.fromEntries(
  layout.map((n) => {
    const pos = getNodePosition(n.col, n.row);
    return [
      n.id,
      {
        ...n,
        ...pos,
      },
    ];
  })
);

    const isDone = (stage: DeviceStatus) => {
        switch(stage) {
        case DeviceStatus.Testing:
            return (deviceChecked & (DeviceLifecycleFlags.TestingDone | DeviceLifecycleFlags.TestingFailed)) !== 0;
        case DeviceStatus.VisualTesting:
            return (deviceChecked & (DeviceLifecycleFlags.VisualTestingDone | DeviceLifecycleFlags.VisualTestingFailed)) !== 0;
        case DeviceStatus.Released:
            return (deviceChecked & DeviceLifecycleFlags.Released) !== 0;
        case DeviceStatus.InWarehouse:
            return (deviceChecked & DeviceLifecycleFlags.InWarehouse) !== 0;
        case DeviceStatus.SentToCustomer:
            return (deviceChecked & DeviceLifecycleFlags.SentToCustomer) !== 0;
        default:
            return (deviceChecked & (1 << stage)) !== 0;
        }
    };

    // Determine node color
    const nodeColor = (stage: DeviceStatus) => {
        switch(stage) {
        case DeviceStatus.Testing:
            if (deviceChecked & DeviceLifecycleFlags.TestingFailed) return "#e74c3c"; // red if failed
            if (deviceChecked & DeviceLifecycleFlags.TestingDone) return "#2ecc71";   // green if done
            break;
        case DeviceStatus.VisualTesting:
            if (deviceChecked & DeviceLifecycleFlags.VisualTestingFailed) return "#e74c3c";
            if (deviceChecked & DeviceLifecycleFlags.VisualTestingDone) return "#2ecc71";
            break;
        case DeviceStatus.Released:
            if (isDone(stage)) return "#2ecc71";
            break;
        default:
            if (isDone(stage)) return "#2ecc71";
        }
        return "#ecf0f1"; // default gray
    };

  return (
    <svg
        width={
            PADDING_X * 1 +
            (Math.max(...layout.map((n) => n.col)) + 1) *
            (NODE_W + COL_GAP)
        }
        height={
            PADDING_Y * 2 +
            (Math.max(...layout.map((n) => n.row)) + 1) *
            (NODE_H + ROW_GAP)
        }
        >
            <defs>
            <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="0"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto"
                markerUnits="strokeWidth"
            >
                <path
                d="M 0 0 L 10 5 L 0 10 Z"
                fill="#9aa0a6"
                />
            </marker>
            </defs>



{edges.map(([from, to], index) => {
  const sameFrom = edges.filter(e => e[0] === from).length;
  const fromIndex =
    edges.filter((e, i) => e[0] === from && i < index).length;

  const sameTo = edges.filter(e => e[1] === to).length;
  const toIndex =
    edges.filter((e, i) => e[1] === to && i < index).length;

  return (
    <Arrow
      key={`${from}-${to}`}
      from={nodes[from]}
      to={nodes[to]}
      fromIndex={fromIndex}
      fromTotal={sameFrom}
      toIndex={toIndex}
      toTotal={sameTo}
    />
  );
})}

        {/* nodes */}
        {Object.values(nodes).map((n) => (
            <Node
            key={n.id}
            x={n.x}
            y={n.y}
            w={NODE_W}
            h={NODE_H}
            label={n.label}
            color={nodeColor(n.stage)}
            setCurrent={() => setCurrent?.(n.stage)}
            isSelected={status === n.stage}
            />
        ))}
        </svg>
  );
}

/* ===================== COMPONENTS ===================== */

function Node({
  x,
  y,
  w,
  h,
  label,
  color,
  setCurrent,
  isSelected = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
  setCurrent?: () => void;
  isSelected?: boolean;
}) {
  const isDefault = color === "#ecf0f1" || color === "#f1f5f9";

  return (
    <>
      <rect
        x={x}
        y={y}
        rx={h / 2}
        ry={h / 2}
        width={w}
        height={h}
        fill={color}
        stroke={isSelected ? "#3b82f6" : "#e2e8f0"}
        strokeWidth={isSelected ? 3 : 1}
        onClick={setCurrent}
        style={{
          cursor: "pointer",
          transition: "all 0.2s ease",
          filter: isSelected
            ? "drop-shadow(0 3px 8px rgba(59,130,246,0.35))"
            : "drop-shadow(0 1px 2px rgba(0,0,0,0.08))",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as SVGRectElement).style.opacity = "0.85";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as SVGRectElement).style.opacity = "1";
        }}
      />

      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fill={isDefault ? "#475569" : "#ffffff"}
        fontSize={13.5}
        fontWeight={500}
        pointerEvents="none"
      >
        {label}
      </text>
    </>
  );
}


function Arrow({
  from,
  to,
  fromIndex = 0,
  fromTotal = 1,
  toIndex = 0,
  toTotal = 1,
}: {
  from: any;
  to: any;
  fromIndex?: number;
  fromTotal?: number;
  toIndex?: number;
  toTotal?: number;
}) {
  const isSameCol = from.col === to.col;
  const isSameRow = from.row === to.row;

  const spread = 6;

  const fromOffset =
    (fromIndex - (fromTotal - 1) / 2) * spread;

  const toOffset =
    (toIndex - (toTotal - 1) / 2) * spread;

  let startX, startY, endX, endY;

  // 👉 vertical
  if (isSameCol) {
    startX = from.x + NODE_W / 2;
    endX = to.x + NODE_W / 2;

    if (from.row < to.row) {
      startY = from.y + NODE_H;
      endY = to.y;
    } else {
      startY = from.y;
      endY = to.y + NODE_H;
    }
  }

  // 👉 horizontal
  else if (isSameRow) {
    startY = from.y + NODE_H / 2 + fromOffset;
    endY = to.y + NODE_H / 2 + toOffset;

    if (from.col < to.col) {
      startX = from.x + NODE_W;
      endX = to.x;
    } else {
      startX = from.x;
      endX = to.x + NODE_W;
    }
  }

  // 👉 diagonal
  else {
    startX = from.x + NODE_W;
    startY = from.y + NODE_H / 2 + fromOffset;

    endX = to.x;
    endY = to.y + NODE_H / 2 + toOffset;
  }

  const dx = endX - startX;

  const shorten = 8;

// shorten endpoint FIRST
const length = Math.hypot(endX - startX, endY - startY);
if (length > 0) {
  endX -= ((endX - startX) / length) * shorten;
  endY -= ((endY - startY) / length) * shorten;
}

const midX = startX + (endX - startX);
const midY = startY + (endY - startY);

const d = `M ${startX} ${startY} L ${endX} ${endY}`;

  return (
    <path
      d={d}
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      markerEnd="url(#arrow)"
      stroke="#94a3b8"
    />
  );
}