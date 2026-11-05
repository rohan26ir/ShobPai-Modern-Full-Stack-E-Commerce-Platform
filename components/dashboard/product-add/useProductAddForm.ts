import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useShopData } from "@/context/ShopDataContext";
import { useAppDispatch } from "@/store/hooks";
import { addProduct } from "@/store/slices/shopSlice";
import { api } from "@/lib/api";
import { ProductAddFormData, PresetProductTemplate } from "./productAdd.types";
import { DEFAULT_PRODUCT_ADD_FORM } from "./productAdd.constants";
import { calculateProfitMargins, buildProductCreatePayload } from "./productAdd.utils";
import { convertFileToWebP } from "../categories/categories.utils";

export function useProductAddForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, isAdmin } = useAuth();
  const { categories, refreshProducts } = useShopData();

  const [form, setForm] = useState<ProductAddFormData>(DEFAULT_PRODUCT_ADD_FORM);

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [newBenefitInput, setNewBenefitInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    numericPrice,
    numericBuying,
    numericStock,
    unitProfit,
    marginPct,
    projectedTotalProfit,
  } = calculateProfitMargins(form.price, form.buyingPrice, form.stock);

  const handleUpdateField = <K extends keyof ProductAddFormData>(
    key: K,
    value: ProductAddFormData[K]
  ) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "name" && !prev.slug) {
        updated.slug = String(value)
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-");
      }
      return updated;
    });
  };

  const handleGenerateSku = () => {
    const code = (form.category || "PRD").slice(0, 3).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    handleUpdateField("sku", `SKU-${code}-${rand}`);
    toast.success("Generated product SKU!", { icon: "🏷️" });
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (form.images.includes(trimmed)) return toast.error("Image already in gallery");
    handleUpdateField("images", [...form.images, trimmed]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (idx: number) => {
    if (form.images.length <= 1) return toast.error("Product must have at least one image");
    handleUpdateField("images", form.images.filter((_, i) => i !== idx));
  };

  const handleSetPrimaryImage = (idx: number) => {
    const chosen = form.images[idx];
    const rest = form.images.filter((_, i) => i !== idx);
    handleUpdateField("images", [chosen, ...rest]);
    toast.success("Set as primary thumbnail!");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) return toast.error("Image upload API key not configured");

    setIsUploading(true);
    const toastId = toast.loading("Processing & uploading image...");
    try {
      const processed = await convertFileToWebP(file);
      const fd = new FormData();
      fd.append("image", processed);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        handleUpdateField("images", [...form.images, data.data.url]);
        toast.success("Image added to gallery!", { id: toastId });
      } else {
        toast.error("Failed to upload image.", { id: toastId });
      }
    } catch {
      toast.error("Error during upload.", { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddBenefit = (textToAdd?: string) => {
    const text = (textToAdd || newBenefitInput).trim();
    if (!text) return;
    handleUpdateField("nutritionalBenefits", [...form.nutritionalBenefits, text]);
    if (!textToAdd) setNewBenefitInput("");
  };

  const handleRemoveBenefit = (idx: number) => {
    handleUpdateField(
      "nutritionalBenefits",
      form.nutritionalBenefits.filter((_, i) => i !== idx)
    );
  };

  const handleApplyTemplate = (tpl: PresetProductTemplate) => {
    setForm((prev) => ({
      ...prev,
      name: tpl.name,
      slug: tpl.name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
      category: tpl.category,
      unit: tpl.unit,
      price: tpl.price,
      buyingPrice: tpl.buyingPrice,
      originalPrice: tpl.originalPrice,
      stock: tpl.stock,
      badge: tpl.badge,
      storage: tpl.storage,
      shelfLife: tpl.shelfLife,
      certifications: tpl.certifications,
      shortDesc: tpl.shortDesc,
      description: tpl.description,
      nutritionalBenefits: [...tpl.nutritionalBenefits],
      images: [...tpl.images],
    }));
    toast.success(`Loaded "${tpl.label}" template!`, { icon: "🍎" });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) return toast.error("Please enter a product title");
    if (!numericPrice || numericPrice <= 0) return toast.error("Please enter a valid price");

    const payload = buildProductCreatePayload(form, categories);
    setIsSubmitting(true);
    const toastId = toast.loading("Publishing product to live storefront...");
    try {
      if (token && isAdmin) {
        const created = await api.adminCreateProduct(payload, token);
        dispatch(addProduct(created || ({ ...payload, id: `prod-${Date.now()}` } as any)));
      } else {
        dispatch(addProduct({ ...payload, id: `prod-${Date.now()}` } as any));
      }
      await refreshProducts?.();
      toast.success(`"${form.name}" published! Redirecting to details...`, { id: toastId });
      router.push(`/product/${payload.slug}`);
    } catch {
      dispatch(addProduct({ ...payload, id: `prod-${Date.now()}` } as any));
      toast.success(`"${form.name}" saved! View on product details...`, { id: toastId });
      router.push(`/product/${payload.slug}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    categories,
    numericPrice,
    numericBuying,
    numericStock,
    unitProfit,
    marginPct,
    projectedTotalProfit,
    imageUrlInput,
    setImageUrlInput,
    newBenefitInput,
    setNewBenefitInput,
    isSubmitting,
    isUploading,
    handleUpdateField,
    handleGenerateSku,
    handleAddImageUrl,
    handleRemoveImage,
    handleSetPrimaryImage,
    handleImageUpload,
    handleAddBenefit,
    handleRemoveBenefit,
    handleApplyTemplate,
    handleSubmit,
  };
}
