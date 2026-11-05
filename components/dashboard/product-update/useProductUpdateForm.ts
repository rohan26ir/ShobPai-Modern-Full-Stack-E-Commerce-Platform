import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useShopData } from "@/context/ShopDataContext";
import { useAppDispatch } from "@/store/hooks";
import { updateProduct } from "@/store/slices/shopSlice";
import { api } from "@/lib/api";
import { ProductAddFormData } from "../product-add/productAdd.types";
import { DEFAULT_PRODUCT_ADD_FORM } from "../product-add/productAdd.constants";
import { calculateProfitMargins, buildProductCreatePayload } from "../product-add/productAdd.utils";
import { convertFileToWebP } from "../categories/categories.utils";

export function useProductUpdateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { token, isAdmin } = useAuth();
  const { products, categories, refreshProducts } = useShopData();

  const productId = searchParams?.get("id") || "";
  const productSlug = searchParams?.get("slug") || "";

  const [form, setForm] = useState<ProductAddFormData>(DEFAULT_PRODUCT_ADD_FORM);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [newBenefitInput, setNewBenefitInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [targetProduct, setTargetProduct] = useState<any>(null);

  // Prepopulate form when product is found or fetched
  useEffect(() => {
    let matched = products?.find((p) => p.id === productId || p.slug === productSlug);

    if (matched) {
      setTargetProduct(matched);
      populateForm(matched);
      setIsLoadingProduct(false);
    } else if (productId || productSlug) {
      setIsLoadingProduct(true);
      api
        .getProduct(productId || productSlug)
        .then((fetched) => {
          if (fetched) {
            setTargetProduct(fetched);
            populateForm(fetched);
          }
        })
        .catch(() => toast.error("Could not load product details"))
        .finally(() => setIsLoadingProduct(false));
    } else {
      setIsLoadingProduct(false);
    }
  }, [productId, productSlug, products]);

  const populateForm = (p: any) => {
    const orig = Number(p.originalPrice) || Number(p.price) || 0;
    const currentPrice = Number(p.price) || 0;
    const calcDiscount =
      typeof p.discount === "number"
        ? p.discount
        : orig > currentPrice && orig > 0
        ? Math.round(((orig - currentPrice) / orig) * 100)
        : 0;

    setForm({
      name: p.name || "",
      slug: p.slug || "",
      category: p.category || (categories[0]?.slug ?? "fresh-fruits"),
      price: p.price ?? 0,
      buyingPrice: p.buyingPrice ?? "",
      originalPrice: p.originalPrice ?? p.price ?? "",
      discount: calcDiscount,
      stock: p.stock ?? 0,
      unit: p.unit || "1 kg",
      sku: p.sku || "",
      badge: p.badge || "Trending",
      shortDesc: p.shortDescription || "",
      description: p.description || "",
      storage: p.storage || "Refrigerate at 4°C - 8°C",
      shelfLife: p.shelfLife || "5 - 7 Days",
      certifications: p.certifications || "100% USDA Organic",
      nutritionalBenefits: Array.isArray(p.nutritionalBenefits) ? p.nutritionalBenefits : [],
      isFeatured: !!p.isFeatured,
      isTrending: !!p.isTrending,
      isDealOfDay: !!p.isDealOfDay,
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [DEFAULT_PRODUCT_ADD_FORM.images[0]],
    });
  };

  const { numericPrice, numericBuying, numericStock, unitProfit, marginPct, projectedTotalProfit } =
    calculateProfitMargins(form.price, form.buyingPrice, form.stock);

  const handleUpdateField = <K extends keyof ProductAddFormData>(
    key: K,
    value: ProductAddFormData[K]
  ) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "discount" && Number(prev.originalPrice) > 0) {
        updated.price = Number((Number(prev.originalPrice) * (1 - (Number(value) || 0) / 100)).toFixed(2));
      } else if (key === "price" && Number(prev.originalPrice) > Number(value)) {
        updated.discount = Math.round(((Number(prev.originalPrice) - Number(value)) / Number(prev.originalPrice)) * 100);
      } else if (key === "originalPrice" && Number(value) > Number(prev.price) && Number(prev.price) > 0) {
        updated.discount = Math.round(((Number(value) - Number(prev.price)) / Number(value)) * 100);
      }
      return updated;
    });
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (form.images.includes(trimmed)) return toast.error("Image already in gallery");
    handleUpdateField("images", [...form.images, trimmed]);
    setImageUrlInput("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) return toast.error("Upload API key not configured");
    setIsUploading(true);
    const toastId = toast.loading("Compressing & uploading...");
    try {
      const processed = await convertFileToWebP(file);
      const fd = new FormData();
      fd.append("image", processed);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        handleUpdateField("images", [...form.images, data.data.url]);
        toast.success("Image added!", { id: toastId });
      } else {
        toast.error("Upload failed.", { id: toastId });
      }
    } catch {
      toast.error("Upload error.", { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) return toast.error("Please enter a product title");
    if (!numericPrice || numericPrice <= 0) return toast.error("Please enter a valid price");
    const activeId = targetProduct?.id || productId;
    if (!activeId) return toast.error("Product ID not found to update");

    const payload = buildProductCreatePayload(form, categories);
    setIsSubmitting(true);
    const toastId = toast.loading("Updating product details...");
    try {
      if (token && isAdmin) {
        const updated = await api.adminUpdateProduct(activeId, payload, token);
        dispatch(updateProduct(updated || { ...payload, id: activeId }));
      } else {
        dispatch(updateProduct({ ...payload, id: activeId } as any));
      }
      await refreshProducts?.();
      toast.success(`"${form.name}" successfully updated!`, { id: toastId });
      router.push("/dashboard/products");
    } catch {
      dispatch(updateProduct({ ...payload, id: activeId } as any));
      toast.success(`"${form.name}" updated locally!`, { id: toastId });
      router.push("/dashboard/products");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    categories,
    targetProduct,
    isLoadingProduct,
    numericPrice,
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
    handleGenerateSku: () =>
      handleUpdateField("sku", `SKU-${(form.category || "PRD").slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`),
    handleAddImageUrl,
    handleRemoveImage: (idx: number) =>
      form.images.length > 1 ? handleUpdateField("images", form.images.filter((_, i) => i !== idx)) : toast.error("At least one image required"),
    handleSetPrimaryImage: (idx: number) =>
      handleUpdateField("images", [form.images[idx], ...form.images.filter((_, i) => i !== idx)]),
    handleImageUpload,
    handleAddBenefit: (textToAdd?: string) => {
      const text = (textToAdd || newBenefitInput).trim();
      if (!text) return;
      handleUpdateField("nutritionalBenefits", [...form.nutritionalBenefits, text]);
      if (!textToAdd) setNewBenefitInput("");
    },
    handleRemoveBenefit: (idx: number) =>
      handleUpdateField("nutritionalBenefits", form.nutritionalBenefits.filter((_, i) => i !== idx)),
    handleSubmit,
  };
}

