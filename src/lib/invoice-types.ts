export type NewInvoice={id:string;customer_id:string;description:string;amount:number;paid_amount:number;currency:string;issued_on:string};
export type SalesInvoice=NewInvoice&{invoice_number:number;created_by_name:string;created_at:string};
