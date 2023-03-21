import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

// import cartItems from "../../cartItems";

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: false,
};

 export const getCartItems = createAsyncThunk("cart/getCartItems", () => {
  return axios
    .get("https://course-api.com/react-useReducer-cart-project")
    .then((response) => response.data);
});
const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, action) => {
      const cartItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCartItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCartItems.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload;
    });
    builder.addCase(getCartItems.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});
// console.log(cartSlice);

export default cartSlice.reducer;
export const { clearCart, removeItem, increase, decrease, calculateTotals, } =
  cartSlice.actions;
