import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as admin from 'firebase-admin';

export const onInvoiceCreatedUpdatedCount =
    onDocumentCreated("companies/{companyId}/invoices/{invoiceId}",
        async (event) => {

            const companyId = event.params.companyId;
            await updateCountHelper(companyId, 'invoices')

        });

export const onCustomersCreatedUpdatedCount =
    onDocumentCreated("companies/{companyId}/customers/{id}",
        async (event) => {


            const companyId = event.params.companyId;
            await updateCountHelper(companyId, 'customers')

        });

export const onExpensesCreatedUpdatedCount =
    onDocumentCreated("companies/{companyId}/expenses/{id}",
        async (event) => {

            const companyId = event.params.companyId;
            await updateCountHelper(companyId, 'expenses')

        });

export const onQuotationCreatedUpdatedCount =
    onDocumentCreated("companies/{companyId}/quotations/{id}",
        async (event) => {

            const companyId = event.params.companyId;
            await updateCountHelper(companyId, 'quotations')

        });


export const onPaymentsCreatedUpdatedCount =
    onDocumentCreated("companies/{companyId}/payments/{id}",
        async (event) => {

            const companyId = event.params.companyId;
            await updateCountHelper(companyId, 'payments')

        });

export const onSalesReceiptsCreatedUpdatedCount =
    onDocumentCreated("companies/{companyId}/salesReceipts/{id}",
        async (event) => {

            const companyId = event.params.companyId;
            await updateCountHelper(companyId, 'salesReceipts')

        });

async function updateCountHelper(companyId: string, propertyName: string) {


    const docRef = admin.firestore().collection("companies").doc(companyId);

    const snapshot = await docRef.get();
    const companyData = snapshot.data();
    const currentCount = companyData?.counters[`${propertyName}`] ?? 1;

    const updatedCounter = {
        ...companyData.counters
    };

    updatedCounter[`${propertyName}`] = currentCount + 1;

    await docRef.set({
        counters: {...updatedCounter}
    }, {merge: true});
}




