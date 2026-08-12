"use client";

import Image from "next/image";
import Link from "next/link";
import { FaMinus, FaPlus, FaShoppingBag, FaTimes, FaTrashAlt } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateQuantity, removeFromCart, subtotal, cartCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 p-5 bg-gray-50/80">
            <div className="flex items-center gap-2">
              <FaShoppingBag className="h-5 w-5 text-[#F0A843]" />
              <h2 className="text-lg font-bold text-gray-900">Your Shopping Cart</h2>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
                {cartCount}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-6 text-gray-500">
                <FaShoppingBag className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-base font-bold text-gray-700">Your cart is empty</p>
                <p className="text-xs text-gray-400 mt-1 mb-6">
                  Add some farm-fresh fruits & vegetables to get started!
                </p>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-[#F0A843] px-6 py-3 text-xs font-bold text-gray-950 hover:bg-[#e09732] transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 p-3 bg-white hover:border-[#F0A843]/50 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="line-clamp-1 text-sm font-bold text-gray-800">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Remove"
                      >
                        <FaTrashAlt className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#F0A843]">
                      ${product.price.toFixed(2)} / {product.unit}
                    </span>

                    {/* Quantity controls & total */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-200 rounded-l-lg cursor-pointer"
                        >
                          <FaMinus className="h-2.5 w-2.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-200 rounded-r-lg cursor-pointer"
                        >
                          <FaPlus className="h-2.5 w-2.5" />
                        </button>
                      </div>

                      <span className="text-sm font-black text-gray-900">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Actions */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50/80 p-5 space-y-3">
              <div className="flex items-center justify-between text-sm font-bold text-gray-800">
                <span>Subtotal</span>
                <span className="text-lg font-black text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Shipping & taxes calculated at checkout. Free shipping on orders over $50.
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#F0A843] py-3.5 text-sm font-black text-gray-950 shadow-md hover:bg-[#e09732] transition-colors"
                >
                  <span>Proceed to Checkout</span>
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex items-center justify-center rounded-xl border border-gray-300 bg-white py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>View Full Cart</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
