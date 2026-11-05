import React from "react";

interface InvoiceAddressesProps {
  customerName: string;
  addressLine: string;
  cityState: string;
  customerEmail: string;
  customerPhone: string;
}

export function InvoiceAddresses({
  customerName,
  addressLine,
  cityState,
  customerEmail,
  customerPhone,
}: InvoiceAddressesProps) {
  return (
    <div className="grid grid-cols-2 gap-8 pt-4">
      {/* Billing From */}
      <div className="space-y-1 text-xs">
        <div className="font-bold uppercase tracking-wider text-slate-800 text-[11px] leading-tight pb-2">
          BILLING FROM
          <br />
          (SELLER)
        </div>
        <div className="font-semibold text-slate-800 text-sm">
          shobPai E-Commerce Ltd.
        </div>
        <div className="text-slate-600">House 14, Road 5, Dhanmondi</div>
        <div className="text-slate-600">Dhaka 1205, Bangladesh</div>
        <div className="text-slate-600">support@shobpai.com</div>
        <div className="text-slate-600">+880 1700-000000</div>
      </div>

      {/* Shipping To */}
      <div className="space-y-1 text-xs">
        <div className="font-bold uppercase tracking-wider text-slate-800 text-[11px] leading-tight pb-2">
          SHIPPING TO
          <br />
          (CUSTOMER)
        </div>
        <div className="font-semibold text-slate-800 text-sm">{customerName}</div>
        <div className="text-slate-600">{addressLine}</div>
        <div className="text-slate-600">{cityState}</div>
        <div className="text-slate-600">{customerEmail}</div>
        <div className="text-slate-600">{customerPhone}</div>
      </div>
    </div>
  );
}

