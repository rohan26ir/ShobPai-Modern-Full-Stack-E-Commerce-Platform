export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg text-gray-700 space-y-6">
        <p>
          Your privacy is important to us. This Privacy Policy explains how ShobPai collects, uses, and protects your personal information when you use our website.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact customer support. This may include your name, email address, shipping address, and payment information.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To process and fulfill your orders</li>
          <li>To communicate with you about your orders and promotional offers</li>
          <li>To improve our website and customer service</li>
          <li>To prevent fraud and maintain security</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Information Sharing</h2>
        <p>
          We do not sell your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Cookies</h2>
        <p>
          We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can choose to disable cookies through your browser settings, but this may affect how the site functions.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Last updated: September 1, 2026
        </p>
      </div>
    </div>
  );
}