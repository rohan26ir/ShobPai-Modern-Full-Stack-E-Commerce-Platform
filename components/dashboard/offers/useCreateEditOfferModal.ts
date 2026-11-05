import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { CouponData } from "./offers.types";

interface UseCreateEditOfferModalProps {
  isOpen: boolean;
  editingCoupon: CouponData | null;
  token: string | null;
  onSuccess: (coupon: CouponData, isEdit: boolean) => void;
  onClose: () => void;
}

export function useCreateEditOfferModal({
  isOpen,
  editingCoupon,
  token,
  onSuccess,
  onClose,
}: UseCreateEditOfferModalProps) {
  const [formCode, setFormCode] = useState("");
  const [formDiscount, setFormDiscount] = useState<number | "">(20);
  const [formMinSpend, setFormMinSpend] = useState<number | "">(0);
  const [formDesc, setFormDesc] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formExpiresAt, setFormExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCoupon) {
      setFormCode(editingCoupon.code);
      setFormDiscount(editingCoupon.discountPercentage);
      setFormMinSpend(editingCoupon.minSpend || 0);
      setFormDesc(editingCoupon.description || "");
      setFormIsActive(editingCoupon.isActive);
      setFormExpiresAt(
        editingCoupon.expiresAt
          ? new Date(editingCoupon.expiresAt).toISOString().split("T")[0]
          : ""
      );
    } else {
      setFormCode("");
      setFormDiscount(20);
      setFormMinSpend(0);
      setFormDesc("");
      setFormIsActive(true);
      setFormExpiresAt("");
    }
  }, [editingCoupon, isOpen]);

  const handleGenerateCode = () => {
    const prefixes = ["FLASH", "MEGA", "SAVE", "DEAL", "PROMO", "SUMMER", "SPECIAL"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = formDiscount ? formDiscount : Math.floor(Math.random() * 4 + 1) * 10;
    setFormCode(`${prefix}${num}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = formCode.trim().toUpperCase();
    if (!code) return toast.error("Please enter a valid coupon code");

    const discount = Number(formDiscount);
    if (isNaN(discount) || discount < 1 || discount > 100) {
      return toast.error("Discount percentage must be between 1 and 100");
    }

    const minSpend = Number(formMinSpend) || 0;
    const description = formDesc.trim() || `${discount}% discount on store purchases`;
    const expiresAt = formExpiresAt ? new Date(formExpiresAt).toISOString() : null;

    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await api.updateCoupon(
          editingCoupon.id,
          { code, discountPercentage: discount, minSpend, description, isActive: formIsActive, expiresAt },
          token
        );
        onSuccess(
          { ...editingCoupon, code, discountPercentage: discount, minSpend, description, isActive: formIsActive, expiresAt },
          true
        );
        toast.success(`Offer "${code}" updated successfully!`);
      } else {
        const payload = {
          code,
          discountPercentage: discount,
          minSpend,
          description,
          isActive: formIsActive,
          expiresAt: expiresAt || undefined,
        };
        const res = await api.createCoupon(payload, token);
        const created: CouponData = res?.id
          ? res
          : { id: `c_${Date.now()}`, ...payload, expiresAt, createdAt: new Date().toISOString() };
        onSuccess(created, false);
        toast.success(`Offer "${code}" created successfully!`);
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formCode,
    setFormCode,
    formDiscount,
    setFormDiscount,
    formMinSpend,
    setFormMinSpend,
    formDesc,
    setFormDesc,
    formIsActive,
    setFormIsActive,
    formExpiresAt,
    setFormExpiresAt,
    isSubmitting,
    handleGenerateCode,
    handleSubmit,
  };
}

