import toast from "react-hot-toast";
import { Order } from "./orders.types";

export async function generateInvoicePdf(
  order: Order,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  onStart?.();
  try {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    // 1. Geometric Yellow Corner Accents
    doc.setFillColor(255, 224, 27);
    doc.rect(175, 0, 35, 16, "F");
    doc.rect(0, 277, 20, 20, "F");

    // 2. Header: Invoice & Order Number
    doc.setFont("helvetica", "normal");
    doc.setFontSize(26);
    doc.setTextColor(30, 30, 30);
    doc.text("Invoice", 20, 32);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    const orderNum = (order.orderNumber || order.id?.slice(0, 8) || "JH56A1").toUpperCase();
    doc.text(`#${orderNum}`, 20, 44);

    // Top Right: Store Name
    doc.setTextColor(255, 108, 47); // #FF6C2F
    doc.text("shobPai", 152, 34);

    // 3. Addresses Section
    const customerName = order.user?.displayName || order.guestName || "Customer";
    const customerEmail = order.user?.email || order.guestEmail || "customer@example.com";
    const customerPhone =
      order.user?.phoneNumber || order.guestPhone || order.shippingAddress?.phone || "+880 1711-000000";
    const addressLine = order.shippingAddress?.addressLine || "Dhanmondi, Dhaka";
    const cityState = order.shippingAddress?.city ? `${order.shippingAddress.city}, Bangladesh` : "Dhaka, Bangladesh";

    // Billing From
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text("BILLING FROM", 20, 62);
    doc.text("(SELLER)", 20, 67);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text("shobPai E-Commerce Ltd.", 20, 75);
    doc.text("House 14, Road 5, Dhanmondi", 20, 80);
    doc.text("Dhaka 1205, Bangladesh", 20, 85);
    doc.text("support@shobpai.com", 20, 90);
    doc.text("+880 1700-000000", 20, 95);

    // Shipping To
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text("SHIPPING TO", 120, 62);
    doc.text("(CUSTOMER)", 120, 67);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(customerName, 120, 75);
    doc.text(addressLine, 120, 80);
    doc.text(cityState, 120, 85);
    doc.text(customerEmail, 120, 90);
    doc.text(customerPhone, 120, 95);

    // 4. Yellow Table Header Banner
    const tableY = 110;
    doc.setFillColor(255, 224, 27);
    doc.rect(20, tableY, 170, 9, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text("Product Description", 23, tableY + 6);
    doc.text("Quantity", 90, tableY + 6);
    doc.text("Unit Price", 115, tableY + 6);
    doc.text("Discount", 145, tableY + 6);
    doc.text("Total", 175, tableY + 6);

    // 5. Table Rows
    let rowY = tableY + 16;
    const items = order.items && order.items.length > 0
      ? order.items
      : [
          { name: "ToasterMaster Toaster", model: "Model: BHT432", quantity: 1, unitPrice: 50.0, discount: 2, total: 49.0 },
          { name: "QuickHeat Pro Microwave Oven", model: "Model: A789", quantity: 1, unitPrice: 150.0, discount: 10, total: 135.0 },
        ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    items.forEach((item: any) => {
      const title = item.product?.name || item.name || "Product Item";
      const modelStr = item.model || `Model: ${item.id?.slice(0, 6).toUpperCase() || "BHT432"}`;
      const qty = item.quantity || 1;
      const price = item.price || item.unitPrice || 50;
      const discountVal = item.discount ? `${item.discount}%` : "0%";
      const rowTotal = item.total || price * qty * (1 - (item.discount || 0) / 100);

      doc.setTextColor(30, 30, 30);
      doc.text(title.slice(0, 32), 23, rowY);
      doc.setTextColor(110, 110, 110);
      doc.setFontSize(8);
      doc.text(`(${modelStr})`, 23, rowY + 4.5);
      doc.setFontSize(9);

      doc.setTextColor(30, 30, 30);
      doc.text(String(qty), 95, rowY);
      doc.text(`$${price.toFixed(2)}`, 118, rowY);
      doc.text(discountVal, 148, rowY);
      doc.text(`$${rowTotal.toFixed(2)}`, 175, rowY);

      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.line(20, rowY + 7, 190, rowY + 7);
      rowY += 13;
    });

    // 6. Financial Summary Box
    let sumY = Math.max(rowY + 10, 185);
    const subtotal = order.subtotal || order.totalAmount || 184.0;
    const discountAmount = order.discountAmount || (order.discount ? order.discount : 15.0);
    const totalAmountPaid = order.totalAmount || 169.0;

    const renderSummaryRow = (label: string, val: string, isBold = false) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      doc.text(label, 125, sumY);
      doc.text(val, 175, sumY);
      doc.setDrawColor(210, 210, 210);
      doc.setLineWidth(0.4);
      doc.line(125, sumY + 2.5, 190, sumY + 2.5);
      sumY += 9;
    };

    renderSummaryRow("Subtotal", `$${subtotal.toFixed(2)}`);
    renderSummaryRow("Discount", `$${discountAmount.toFixed(2)}`);
    renderSummaryRow("Total Amount Paid", `$${totalAmountPaid.toFixed(2)}`, true);
    renderSummaryRow("Total Due", "$0.00", true);

    // 7. Footer Notes
    const notesY = 245;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text("Please note: Your order will be shipped within 2 to 5 business days.", 20, notesY);
    doc.text("Please inspect all fresh organic items upon receiving.", 20, notesY + 4.5);
    doc.text("Queries: +880 1700-000000 | support@shobpai.com", 20, notesY + 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text("Thank you for shopping with shobPai!", 20, notesY + 18);

    doc.save(`Invoice_${orderNum}.pdf`);
    toast.success("Invoice PDF downloaded!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to generate PDF");
  } finally {
    onEnd?.();
  }
}
