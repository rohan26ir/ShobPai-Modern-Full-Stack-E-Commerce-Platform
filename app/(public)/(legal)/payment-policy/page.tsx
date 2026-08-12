export default function PaymentPolicyPage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl space-y-6 text-xs text-gray-600 leading-relaxed">
        <h1 className="text-3xl font-black text-gray-900 border-b border-gray-100 pb-4">
          Payment Methods & Policy
        </h1>
        <p>
          Vegist offers flexible payment options to ensure a smooth shopping experience.
        </p>

        <h3 className="text-sm font-bold text-gray-900 mt-4">1. Cash on Delivery (COD)</h3>
        <p>
          Pay cash directly to our delivery executive when your organic produce box arrives at your doorstep.
        </p>

        <h3 className="text-sm font-bold text-gray-900 mt-4">2. Online Payment Gateway</h3>
        <p>
          We accept major debit and credit cards (Visa, MasterCard, American Express). All transactions are encrypted with 256-bit SSL technology.
        </p>
      </div>
    </div>
  );
}