/*
getTotalPaidAndReceivable(customer.id)
 */

import {Invoice, PaymentReceived} from "../../shared/models";

export function getTotalPaidAndReceivable(customerId: string, invoiceData: Invoice[], paymentReceivedData: PaymentReceived[], salesReceiptsData: []) {
    const invoiceTotal = calculateTotal(customerId, invoiceData);
    const paymentsReceivedTotal = calculateTotal(customerId, paymentReceivedData);
    const salesReceiptsTotal = calculateTotal(customerId, salesReceiptsData);

    return {
        totalInvoice: invoiceTotal,
        receivable: invoiceTotal - paymentsReceivedTotal,
        total: paymentsReceivedTotal
    };
}

function calculateTotal(customerId: string, data: { customer: { id?: string } | null, amount: number }[]) {
    const items = data.filter(inv => inv?.customer?.id === customerId);
    // console.log(allCustomerInvoice);
    return items
        .reduce((acc, item) => acc + Number(item.amount), 0);
}

/*function getCustomerTotal(customerId: string) {

    return {
        invoiceTotal: calculateTotal(customerId, invoiceData),
        quotationTotal: calculateTotal(customerId, quotationData),
        paymentsReceivedTotal: calculateTotal(customerId, paymentReceivedData),
        expensesTotal: calculateTotal(customerId, expensesData),
        salesReceiptsTotal: calculateTotal(customerId, salesReceiptsData),

    };
}*/
