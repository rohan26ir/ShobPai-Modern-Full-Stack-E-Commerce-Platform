export function convertFileToWebP(file: File, quality = 0.85): Promise<File> {
  return new Promise((resolve) => {
    if (
      file.type === "image/webp" ||
      file.type === "image/svg+xml" ||
      file.type === "image/gif"
    ) {
      resolve(file);
      return;
    }

    const img = document.createElement("img");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const webpFile = new File([blob], cleanName, { type: "image/webp" });
            resolve(webpFile);
          } else {
            resolve(file);
          }
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

export function generateAICategoryDescription(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes("veg") || lower.includes("leaf") || lower.includes("green")) {
    return "Crisp, nutrient-dense organic farm produce harvested at dawn and delivered with peak freshness.";
  }
  if (lower.includes("fruit") || lower.includes("berry") || lower.includes("citrus")) {
    return "Naturally sweet, vitamin-rich tree-ripened fruits sourced directly from sustainable orchards.";
  }
  if (lower.includes("fashion") || lower.includes("cloth") || lower.includes("wear")) {
    return "Contemporary, high-quality fashion essentials designed for effortless everyday style and comfort.";
  }
  if (lower.includes("dairy") || lower.includes("milk") || lower.includes("egg")) {
    return "Wholesome, pasture-raised farm fresh dairy and free-range eggs rich in pure wholesome nutrition.";
  }
  if (lower.includes("bag") || lower.includes("shoe") || lower.includes("accessories")) {
    return "Crafted leather goods and refined lifestyle essentials combining artisanal durability with elegance.";
  }
  if (lower.includes("electronic") || lower.includes("gadget") || lower.includes("watch")) {
    return "Next-generation smart electronics and premium tech accessories engineered for modern productivity.";
  }
  return "Handpicked, premium selection tailored for modern quality and daily convenience.";
}

