import { useState } from "react";
import toast from "react-hot-toast";
import { Product } from "@/data/products";
import { api } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { addProduct, updateProduct } from "@/store/slices/shopSlice";
import { TableProduct } from "./products.types";

interface UseProductFormModalProps {
  initialData?: TableProduct;
  token?: string | null;
  onSuccess: () => void;
}

export function useProductFormModal({
  initialData,
  token,
  onSuccess,
}: UseProductFormModalProps) {
  const dispatch = useAppDispatch();
  const isEdit = !!initialData;

  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    buyingPrice: initialData?.buyingPrice || 0,
    originalPrice: initialData?.originalPrice || 0,
    category: initialData?.category || "fashion",
    stock: initialData?.stock || 50,
    unit: initialData?.unit || "Size : S , M , L",
    images: initialData?.images || [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    ],
    shortDescription: initialData?.shortDescription || "Quality item from our premium catalog.",
    description:
      initialData?.description || "Crafted with superior materials to ensure lasting durability and comfort.",
  });

  const formPrice = Number(formData.price || 0);
  const formBuying = Number(formData.buyingPrice || 0);
  const formProfit = formPrice - formBuying;
  const formMargin =
    formPrice > 0 && formBuying > 0 ? ((formProfit / formPrice) * 100).toFixed(1) : "0.0";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Please enter a product name");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(isEdit ? "Updating product..." : "Creating product...");

    try {
      if (token && isEdit && initialData.id && !initialData.id.startsWith("prod-")) {
        const updated = await api.adminUpdateProduct(initialData.id, formData, token);
        dispatch(updateProduct(updated || { ...initialData, ...formData }));
      } else if (token && !isEdit) {
        const created = await api.adminCreateProduct(formData, token);
        dispatch(addProduct(created || ({ ...formData, id: `prod-${Date.now()}` } as any)));
      } else if (isEdit) {
        dispatch(updateProduct({ ...initialData, ...formData } as any));
      } else {
        dispatch(addProduct({ ...formData, id: `prod-${Date.now()}` } as any));
      }
      toast.success(isEdit ? "Product updated successfully!" : "Product published successfully!", {
        id: toastId,
      });
      onSuccess();
    } catch {
      if (isEdit) {
        dispatch(updateProduct({ ...initialData, ...formData } as any));
      } else {
        dispatch(addProduct({ ...formData, id: `prod-${Date.now()}` } as any));
      }
      toast.success(isEdit ? "Product changes saved!" : "Product added to catalog!", {
        id: toastId,
      });
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEdit,
    formData,
    setFormData,
    formPrice,
    formBuying,
    formProfit,
    formMargin,
    isSubmitting,
    handleSubmit,
  };
}

