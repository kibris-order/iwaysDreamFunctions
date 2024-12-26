
export interface Base{
    id:string
}

export interface ItemsTable {
    id: string,
    itemDetails: string,
    quantity: number,
    rate: number,
    tax: number,
}

export interface Expenses{
    id:string;
    date:string,
    expenseAccount:string,
    referenceNo:string,
    customer:Customer|null,
    status:'NON-BILLABLE'|'BILLABLE',
    amount:number,
}

export interface Customer extends Base {
    name: string;
    companyName: string;
    email: string;
    address: string;
    state:string;
    workphone: string;
    amountReceivable: number;
    totalAmountPaid: number;
    contactPerson: string;
}

export interface Invoice extends Base {
    id: string,
    date: string,
    invoice: string,
    orderNumber: string,
    customer: Customer,
    status: 'INVOICED' | 'DRAFT' | 'PAID' | 'OVERDUE' | 'PARTIAL',
    amount: number,
    items: ItemsTable[],
    balanceDue: number,
    dueDate: string,
    salesPerson: string,
}


export interface PaymentReceived extends Base {
    id: string,
    date: string,
    paymentNumber: string,
    referenceNumber: string,
    customer:Customer,
    invoiceNumber: string,
    items: ItemsTable[],
    mode: 'Cash'|'Bank Transfer'| 'POS',
    amount:number,
    salesPerson:string,
}

export interface Quotation extends Base{
    id:string,
    date:string,
    quotationNo:string,
    orderNumber:string,
    customer:Customer,
    status:'INVOICED'|'PENDING',
    amount:number,
    items: ItemsTable[],
    salesPerson: string,
    expiryDate:string,
}

export interface SalesReceipts extends Base{
    id:string,
    date:string,
    saleReceiptNo:string,
    reference:string,
    customer:Customer,
    paymentMode:string,
    status:'PAID'|'PARTIAL',
    amount:number,
    items: ItemsTable[],
    createdBy:string,
    salesPerson:string,
}