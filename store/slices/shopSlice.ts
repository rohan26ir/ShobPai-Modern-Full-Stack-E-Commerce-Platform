import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/data/products";
import { Category } from "@/data/categories";
import { api } from "@/lib/api";

export interface ShopState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  productsLoading: boolean;
  categoriesLoading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  products: [],
  categories: [],
  loading: true,
  productsLoading: true,
  categoriesLoading: true,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "shop/fetchProducts",
  async (params: { category_slug?: string; search?: string; featured?: boolean; trending?: boolean } | void, { rejectWithValue }) => {
    try {
      const data = await api.getProducts(params || undefined);
      return data;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to fetch products");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "shop/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getCategories();
      return data;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to fetch categories");
    }
  }
);

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.productsLoading = false;
      state.loading = state.categoriesLoading;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      const filtered = state.products.filter(
        (p) => p.id !== action.payload.id && p.slug !== action.payload.slug
      );
      state.products = [action.payload, ...filtered];
      if (typeof window !== "undefined") {
        try {
          const current: Product[] = JSON.parse(localStorage.getItem("shobpai_custom_products") || "[]");
          const updated = [action.payload, ...current.filter((p) => p.id !== action.payload.id && p.slug !== action.payload.slug)];
          localStorage.setItem("shobpai_custom_products", JSON.stringify(updated));
        } catch {}
      }
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      state.products = state.products.map((p) =>
        p.id === action.payload.id ? action.payload : p
      );
      if (typeof window !== "undefined") {
        try {
          const current: Product[] = JSON.parse(localStorage.getItem("shobpai_custom_products") || "[]");
          const updated = current.map((p) => p.id === action.payload.id ? action.payload : p);
          localStorage.setItem("shobpai_custom_products", JSON.stringify(updated));
        } catch {}
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      if (typeof window !== "undefined") {
        try {
          const current: Product[] = JSON.parse(localStorage.getItem("shobpai_custom_products") || "[]");
          const updated = current.filter((p) => p.id !== action.payload);
          localStorage.setItem("shobpai_custom_products", JSON.stringify(updated));
        } catch {}
      }
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.categoriesLoading = false;
      state.loading = state.productsLoading;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.loading = state.categoriesLoading;
        const fetched = action.payload || [];
        if (typeof window !== "undefined") {
          try {
            const localCustom: Product[] = JSON.parse(localStorage.getItem("shobpai_custom_products") || "[]");
            const fetchedIds = new Set(fetched.map((p: Product) => p.id));
            const fetchedSlugs = new Set(fetched.map((p: Product) => p.slug));
            const activeCustom = localCustom.filter(
              (cp) => !fetchedIds.has(cp.id) && !fetchedSlugs.has(cp.slug)
            );
            state.products = [...activeCustom, ...fetched];
            return;
          } catch {}
        }
        state.products = fetched;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.loading = state.categoriesLoading;
        state.error = action.payload as string;
      });

    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.loading = state.productsLoading;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.loading = state.productsLoading;
        state.error = action.payload as string;
      });
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct, setCategories } = shopSlice.actions;

export default shopSlice.reducer;
