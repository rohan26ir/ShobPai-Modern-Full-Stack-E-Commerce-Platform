import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Category } from "@/data/categories";
import { api } from "@/lib/api";
import { COLOR_PRESETS, IMAGE_PRESETS, SUPPORTED_IMAGE_TYPES } from "./categories.constants";
import { convertFileToWebP, generateAICategoryDescription } from "./categories.utils";

interface UseCategoryFormModalProps {
  isEdit: boolean;
  initialData?: Category | null;
  token?: string | null;
  onSuccess: () => void;
}

export function useCategoryFormModal({
  isEdit,
  initialData,
  token,
  onSuccess,
}: UseCategoryFormModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [image, setImage] = useState(initialData?.image || IMAGE_PRESETS[0].url);
  const [bgColor, setBgColor] = useState(initialData?.bgColor || COLOR_PRESETS[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
      setDescription(initialData.description || "");
      setImage(initialData.image || IMAGE_PRESETS[0].url);
      setBgColor(initialData.bgColor || COLOR_PRESETS[0].value);
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setImage(IMAGE_PRESETS[0].url);
      setBgColor(COLOR_PRESETS[0].value);
    }
  }, [initialData]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit || !slug) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isSupported =
      SUPPORTED_IMAGE_TYPES.includes(file.type) ||
      /\.(webp|avif|jpe?g|png|svg|gif)$/i.test(file.name);

    if (!isSupported) {
      toast.error("Unsupported file format! Please upload WebP, AVIF, JPEG, PNG, SVG, or GIF.");
      e.target.value = "";
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("Image upload API key not configured");
      return;
    }

    setIsUploadingImage(true);
    const toastId = toast.loading("Optimizing & uploading image...");
    try {
      const processed = await convertFileToWebP(file);
      const formData = new FormData();
      formData.append("image", processed);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.data.url);
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error("Failed to upload image.", { id: toastId });
      }
    } catch {
      toast.error("An error occurred during image upload.", { id: toastId });
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleGenerateAI = () => {
    if (!name.trim()) {
      toast.error("Please enter a category name first!");
      return;
    }
    setIsGeneratingAI(true);
    const toastId = toast.loading(`Generating description for "${name}"...`);
    setTimeout(() => {
      setDescription(generateAICategoryDescription(name));
      setIsGeneratingAI(false);
      toast.success("AI description generated!", { id: toastId });
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    const payload: Partial<Category> = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/\s+/g, "-"),
      description: description.trim(),
      image: image.trim() || IMAGE_PRESETS[0].url,
      bgColor: bgColor || COLOR_PRESETS[0].value,
    };

    setIsSubmitting(true);
    const toastId = toast.loading(isEdit ? "Updating category..." : "Creating category...");
    try {
      if (isEdit && initialData?.id) {
        await api.updateCategory(initialData.id, payload, token);
      } else {
        await api.createCategory(payload, token);
      }
      toast.success(isEdit ? "Category updated successfully!" : "Category created successfully!", {
        id: toastId,
      });
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save category", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName: handleNameChange,
    slug,
    setSlug,
    description,
    setDescription,
    image,
    setImage,
    bgColor,
    setBgColor,
    isSubmitting,
    isGeneratingAI,
    isUploadingImage,
    handleImageUpload,
    handleGenerateAI,
    handleSubmit,
  };
}

