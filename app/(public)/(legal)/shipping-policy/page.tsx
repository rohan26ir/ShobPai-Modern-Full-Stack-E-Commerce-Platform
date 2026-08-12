export default function ShippingPolicyPage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl space-y-6 text-xs text-gray-600 leading-relaxed">
        <h1 className="text-3xl font-black text-gray-900 border-b border-gray-100 pb-4">
          Shipping & Delivery Policy
        </h1>
        <p>
          At <strong>Vegist / ShobPai</strong>, we take pride in delivering farm-fresh organic produce directly from certified local farms to your home in temperature-controlled packaging.
        </p>

        <h3 className="text-sm font-bold text-gray-900 mt-4">1. Delivery Zones & Timelines</h3>
        <p>
          Orders placed before 10:00 AM are eligible for Same-Day Express Delivery. Orders placed after 10:00 AM will be delivered the following morning between 8:00 AM and 1:00 PM.
        </p>

        <h3 className="text-sm font-bold text-gray-900 mt-4">2. Shipping Charges</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Free Express Shipping:</strong> Available on all orders of $50.00 or more.</li>
          <li><strong>Standard Flat Rate:</strong> $4.99 flat shipping fee for orders under $50.00.</li>
        </ul>

        <h3 className="text-sm font-bold text-gray-900 mt-4">3. Freshness Packaging Guarantee</h3>
        <p>
          Perishable items like organic milk, fresh berries, and leafy greens are packed in biodegradable insulated liners with non-toxic gel ice packs to ensure optimal cold chain maintenance.
        </p>
      </div>
    </div>
  );
}