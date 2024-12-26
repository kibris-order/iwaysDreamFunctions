import {getAllSubCollectionDocs} from "./helpers/_shared";
import {Customer, Expenses, Invoice, PaymentReceived, Quotation, SalesReceipts} from "../shared/models";
import * as admin from "firebase-admin";
import {onDocumentWritten} from "firebase-functions/v2/firestore";

export const onExpensesWritten = onDocumentWritten("companies/{companyId}/expenses/{id}",
    async (event) => {

        const companyId = event.params.companyId;
        await calculateCompanyTotals(companyId);

    });

export const onInvoiceWritten = onDocumentWritten("companies/{companyId}/invoice/{id}",
    async (event) => {

        const companyId = event.params.companyId;
        await calculateCompanyTotals(companyId);

    });

export const onPaymentReceivedWritten = onDocumentWritten("companies/{companyId}/payments/{id}",
    async (event) => {

        const companyId = event.params.companyId;
        await calculateCompanyTotals(companyId);

    });

export const onQuotationsWritten = onDocumentWritten("companies/{companyId}/quotations/{id}",
    async (event) => {

        const companyId = event.params.companyId;
        await calculateCompanyTotals(companyId);

    });

export const onSalesReceiptsWritten = onDocumentWritten("companies/{companyId}/salesReceipts/{id}",
    async (event) => {

        const companyId = event.params.companyId;
        await calculateCompanyTotals(companyId);

    });


async function calculateCompanyTotals(companyId: string) {
    const customerData = await getAllSubCollectionDocs<Customer>(companyId, 'customers');
    const invoiceData = await getAllSubCollectionDocs<Invoice>(companyId, 'invoices');
    const paymentReceivedData = await getAllSubCollectionDocs<PaymentReceived>(companyId, 'payments');
    const salesReceiptsData = await getAllSubCollectionDocs<SalesReceipts>(companyId, 'salesReceipts');
    const quotationData = await getAllSubCollectionDocs<Quotation>(companyId, 'quotations');
    const expensesData = await getAllSubCollectionDocs<Expenses>(companyId, 'expenses');


    const invoices = calculateTotal(invoiceData);
    const paymentsReceived = calculateTotal(paymentReceivedData);
    const salesReceipts = calculateTotal(salesReceiptsData);
    const quotations = calculateTotal(quotationData);
    const expenses = calculateTotal(expensesData);

    const docRef = admin.firestore()
        .collection('companies')
        .doc(companyId)
        .collection('dashboard')
        .doc('STATS');


    await docRef.set({
        countTotal: {
            customers: customerData.length,
            invoices: invoiceData.length,
            paymentsReceived: paymentReceivedData.length,
            salesReceipts: salesReceiptsData.length,
            quotations: quotationData.length,
            expenses: expensesData.length,
        },
        amountTotals: {
            customers: customerData.length,
            invoices: invoices,
            paymentsReceived: paymentsReceived,
            salesReceipts: salesReceipts,
            quotations: quotations,
            expenses: expenses,
        }
    }, {merge: true});
}

function calculateTotal(data: { amount: number }[]) {
    return data
        .reduce((acc, item) => acc + Number(item.amount), 0);
}