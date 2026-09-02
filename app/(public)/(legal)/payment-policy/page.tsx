export default function PaymentPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Payment Policy</h1>
      
      <div className="prose prose-lg text-gray-700 space-y-6">
        <p>
          At ShobPai, we strive to make your shopping experience as seamless as possible. We accept a variety of payment methods to ensure convenience and security.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Accepted Payment Methods</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Credit and Debit Cards (Visa, MasterCard, American Express)</li>
          <li>Digital Wallets (Apple Pay, Google Pay, PayPal)</li>
          <li>Bank Transfers</li>
          <li>Cash on Delivery (Available in select regions)</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Payment Security</h2>
        <p>
          All transactions are encrypted and processed through secure gateways. We do not store your credit card information on our servers. Your financial data is handled directly by our PCI-compliant payment processors.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Currency</h2>
        <p>
          All prices listed on our website are in US Dollars (USD) unless otherwise stated. If you are shopping internationally, your bank may apply a conversion rate.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Last updated: September 1, 2026
        </p>
      </div>
    </div>
  );
}