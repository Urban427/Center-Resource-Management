export type Trash = {
    id: number;
    entityName: string;
    entityKey: string;
    deletedAt: Date;
    expiresAt: Date;
    deletedBy?: string;
    reason?: string;
};

export type TrashTableProps = {
  data: Trash[];
  onRestore: (trash: Trash) => void;
  onQr: (trash: Trash) => void;
  onTrash: (trash: Trash) => void;
};