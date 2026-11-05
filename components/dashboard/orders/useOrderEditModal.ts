import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateOrderStatusThunk } from "@/store/slices/dashboardSlice";
import { Order, CustomDeliveryOverride } from "./orders.types";
import toast from "react-hot-toast";

export function useOrderEditModal(
  token: string | null | undefined,
  isAdmin: boolean,
  viewingOrder: Order | null,
  setViewingOrder: (fn: any) => void
) {
  const dispatch = useAppDispatch();

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState<string>("PENDING");
  const [editPaymentStatus, setEditPaymentStatus] = useState<string>("PAID");
  const [editDeliveryDate, setEditDeliveryDate] = useState<string>("");
  const [editDeliveryNote, setEditDeliveryNote] = useState<string>("");
  const [customDeliveryOverrides, setCustomDeliveryOverrides] = useState<
    Record<string, CustomDeliveryOverride>
  >({});
  const [savingEdit, setSavingEdit] = useState(false);

  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setEditStatus((order.status || "PENDING").toUpperCase());
    setEditPaymentStatus((order.paymentStatus || "PAID").toUpperCase());

    const override = customDeliveryOverrides[order.id];
    if (override?.deliveryDate) {
      setEditDeliveryDate(override.deliveryDate);
      setEditDeliveryNote(override.deliveryNote || "");
    } else if (order.estimatedDeliveryDate) {
      const d = new Date(order.estimatedDeliveryDate);
      setEditDeliveryDate(!isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "");
      setEditDeliveryNote(order.deliveryNote || "");
    } else {
      const baseTime = order.createdAt ? new Date(order.createdAt).getTime() : Date.now();
      const d = new Date(baseTime + 3 * 24 * 60 * 60 * 1000);
      setEditDeliveryDate(d.toISOString().split("T")[0]);
      setEditDeliveryNote("");
    }
  };

  const extendDeliveryDays = (days: number) => {
    try {
      const current = editDeliveryDate ? new Date(editDeliveryDate) : new Date();
      const validCurrent = isNaN(current.getTime()) ? new Date() : current;
      validCurrent.setDate(validCurrent.getDate() + days);
      const newFormattedDate = validCurrent.toISOString().split("T")[0];
      setEditDeliveryDate(newFormattedDate);
      toast.success(
        `Extended delivery by +${days} day${days > 1 ? "s" : ""} (${new Date(
          newFormattedDate
        ).toLocaleDateString("en-US", { month: "short", day: "numeric" })})`,
        { icon: "📅" }
      );
    } catch {
      // fallback
    }
  };

  const handleSaveOrderEdit = async () => {
    if (!editingOrder) return;
    setSavingEdit(true);

    try {
      if (token && isAdmin) {
        await dispatch(
          updateOrderStatusThunk({ orderId: editingOrder.id, status: editStatus, token })
        ).unwrap();
      }

      setCustomDeliveryOverrides((prev) => ({
        ...prev,
        [editingOrder.id]: {
          deliveryDate: editDeliveryDate,
          deliveryNote: editDeliveryNote.trim(),
        },
      }));

      const dateDisplay = editDeliveryDate
        ? ` • Delivery: ${new Date(editDeliveryDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`
        : "";

      toast.success(`Order #${editingOrder.orderNumber || editingOrder.id} updated!${dateDisplay}`);

      if (viewingOrder && viewingOrder.id === editingOrder.id) {
        setViewingOrder((prev: any) => ({
          ...prev,
          status: editStatus,
          paymentStatus: editPaymentStatus,
          estimatedDeliveryDate: editDeliveryDate,
          deliveryNote: editDeliveryNote.trim(),
        }));
      }
      setEditingOrder(null);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setSavingEdit(false);
    }
  };

  return {
    editingOrder,
    setEditingOrder,
    editStatus,
    setEditStatus,
    editPaymentStatus,
    setEditPaymentStatus,
    editDeliveryDate,
    setEditDeliveryDate,
    editDeliveryNote,
    setEditDeliveryNote,
    customDeliveryOverrides,
    savingEdit,
    openEditModal,
    extendDeliveryDays,
    handleSaveOrderEdit,
  };
}

