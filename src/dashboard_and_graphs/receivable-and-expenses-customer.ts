//trigger onUpdate// companies/{companyId}/ invoice, paymentReceived, salesReceipt
//what to do: callculate totalPaid, totalReceivable for that customer
//where to save: //update companies/{companyId}/customer/{customerId}

import {onDocumentWritten} from "firebase-functions/v2/firestore";
import { Invoice, PaymentReceived, SalesReceipts} from "../shared/models";
import {getTotalPaidAndReceivable} from "./helpers/_customer-totals.helper";
import {getAllSubCollectionDocs} from "./helpers/_shared";
import * as admin from "firebase-admin";

export const onPaymentReceivedWritten = onDocumentWritten("companies/{companyId}/payments/{paymentId}",
    async (event) => {


        const document = event.data.after.data() as PaymentReceived;

        const companyId = event.params.companyId;
        if (document.customer) {
            const customerId = document?.customer.id;

            await calculateCustomerTotals(companyId, customerId);
        }

    });

export const onInvoiceWritten = onDocumentWritten("companies/{companyId}/invoices/{invoiceId}",
    async (event) => {


        const document = event.data.after.data() as Invoice;
        const companyId = event.params.companyId;
        if (document.customer) {
            const customerId = document?.customer.id;

            await calculateCustomerTotals(companyId, customerId);
        }

        // perform more operations ...
    });

export const onSalesReceiptWritten = onDocumentWritten("companies/{companyId}/salesReceipts/{salesReceiptId}",
    async (event) => {


        const document = event.data.after.data() as SalesReceipts;
        const companyId = event.params.companyId;
        if (document.customer) {
            const customerId = document?.customer.id;

            await calculateCustomerTotals(companyId, customerId);
        }
    });


async function calculateCustomerTotals(companyId: string, customerId: string) {
    const invoiceData = await getAllSubCollectionDocs<Invoice>(companyId, 'invoices', customerId);
    const paymentReceivedData = await getAllSubCollectionDocs<PaymentReceived>(companyId, 'payments', customerId);
    const salesReceiptsData = await getAllSubCollectionDocs<SalesReceipts>(companyId, 'salesReceipts', customerId);

    const data = getTotalPaidAndReceivable(customerId, invoiceData, paymentReceivedData, salesReceiptsData);

    const docRef = admin.firestore()
        .collection('companies')
        .doc(companyId)
        .collection('customers')
        .doc(customerId);

    await docRef.set({
        totals: {...data}
    }, {merge: true});
}