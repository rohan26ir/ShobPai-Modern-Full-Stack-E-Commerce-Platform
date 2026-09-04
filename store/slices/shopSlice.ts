import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/data/products";
import { Category } from "@/data/categories";
import { api } from "@/lib/api";

export interface ShopState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  products: [],
  categories: [],
  loading: false,
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
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setProducts, setCategories } = shopSlice.actions;

export default shopSlice.reducer;
