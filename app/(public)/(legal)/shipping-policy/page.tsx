export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Shipping Policy</h1>
      
      <div className="prose prose-lg text-gray-700 space-y-6">
        <p>
          We are committed to delivering your orders as quickly and freshly as possible. Please read our shipping policy to understand our processes and delivery times.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Processing Time</h2>
        <p>
          All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Local Delivery (Perishables)</h2>
        <p>
          For fresh produce and perishable goods, we offer same-day or next-day local delivery within our designated service areas. Deliveries are made between 9:00 AM and 6:00 PM. We recommend someone being home to receive perishable items to ensure freshness.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Standard Shipping (Non-Perishables)</h2>
        <p>
          For non-perishable goods, we offer standard shipping nationwide. Shipping charges for your order will be calculated and displayed at checkout. Standard shipping typically takes 3-5 business days.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Free Shipping</h2>
        <p>
          We offer free standard shipping and local delivery on all orders over $50. For orders under $50, a flat rate shipping fee will apply.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Last updated: September 1, 2026
        </p>
      </div>
    </div>
  );
}