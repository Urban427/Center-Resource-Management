export type Booking = {
  id: number;
  deviceTypeId: number;
  deviceTypeName: string;
  numberOfDevices: number;
  comment: string;
  status: number;
  createdAt: string;
  completedAt: string | null;
};

export type BookingSelectorProps = {
  data: Booking[];
  refresh?: () => void;
};

export type BookingFormProps = {
  initialDeviceTypeId?: number | "";
  onClose: () => void;
  onSave: (book: Booking) => Promise<void>;
};

export type BookingTableProps = {
  data: Booking[];
  onEdit: (booking: Booking) => void;
  onHistory: (booking: Booking) => void;
  onQr: (booking: Booking) => void;
  onTrash: (booking: Booking) => void;
};