export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl space-y-6 text-xs text-gray-600 leading-relaxed">
        <h1 className="text-3xl font-black text-gray-900 border-b border-gray-100 pb-4">
          Privacy Policy
        </h1>
        <p>
          Your privacy is important to us. This Privacy Policy describes how Vegist / ShobPai collects, uses, and safeguards your personal data when you visit or make a purchase from our store.
        </p>

        <h3 className="text-sm font-bold text-gray-900 mt-4">1. Data We Collect</h3>
        <p>
          We collect personal information such as your name, delivery address, email address, phone number, and order details necessary to fulfill your purchases.
        </p>

        <h3 className="text-sm font-bold text-gray-900 mt-4">2. Security</h3>
        <p>
          We employ 256-bit SSL encryption to ensure your personal and payment details are safe from unauthorized access.
        </p>
      </div>
    </div>
  );
}