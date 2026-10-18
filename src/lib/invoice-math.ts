// Validated monetary inputs have at most two decimals. Subtract integer cents to avoid negative zero.
const cents=(amount:number)=>Math.round(amount*100);
export const invoiceNet=(amount:number,discount=0)=>(cents(amount)-cents(discount))/100;
export const invoiceRemaining=(amount:number,discount:number,paid:number)=>(cents(amount)-cents(discount)-cents(paid))/100;
