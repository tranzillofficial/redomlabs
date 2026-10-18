export type InvoiceEdit={id:string;type:'sales'|'purchases';revision:number;mutation_id:string;description:string;amount:number;discount_amount:number;paid_amount:number;date:string;category:string};
export type PaymentEdit={id:string;updated_at:string;paid_amount:number;mutation_id:string};
