export default function TermsConditionsPage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl space-y-6 text-xs text-gray-600 leading-relaxed">
        <h1 className="text-3xl font-black text-gray-900 border-b border-gray-100 pb-4">
          Terms & Conditions
        </h1>
        <p>
          By accessing or using the Vegist storefront, you agree to comply with and be bound by these Terms of Service.
        </p>

        <h3 className="text-sm font-bold text-gray-900 mt-4">1. Store Usage</h3>
        <p>
          You agree to provide accurate, current, and complete information during checkout and to maintain the security of your account credentials.
        </p>

        <h3 className="text-sm font-bold text-gray-900 mt-4">2. Product Availability & Pricing</h3>
        <p>
          Prices and product stock levels are subject to change without prior notice. We reserve the right to modify or discontinue any item at any time.
        </p>
      </div>
    </div>
  );
}