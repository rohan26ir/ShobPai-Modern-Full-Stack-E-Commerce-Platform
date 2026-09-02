export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Return Policy</h1>
      
      <div className="prose prose-lg text-gray-700 space-y-6">
        <p>
          We want you to be completely satisfied with your purchase from ShobPai. If you are not satisfied, we are here to help.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Returns</h2>
        <p>
          You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging and needs to have the receipt or proof of purchase.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Perishable Goods</h2>
        <p>
          Please note that perishable goods such as fresh fruits, vegetables, meat, and dairy products are exempt from being returned due to health and safety regulations. If you receive a damaged or spoiled perishable item, please contact us within 24 hours of delivery for a refund or replacement.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Refunds</h2>
        <p>
          Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your credit card (or original method of payment).
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Shipping Costs for Returns</h2>
        <p>
          You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Last updated: September 1, 2026
        </p>
      </div>
    </div>
  );
}