import {onDocumentWritten} from "firebase-functions/v2/firestore";
import {Expenses, Invoice} from "../shared/models";
import * as admin from "firebase-admin";
import {calculateMonthlyTotals} from "./helpers/_graph-sales-expenses.helper";
import {getAllSubCollectionDocs, getCurrentMonth} from "./helpers/_shared";


//we are doing the grouping for each company
//Trigger: when invoice/expenses created/updated
//what to do: run aggregation for the company and update the data
//where to save: companies/{companyId}/dashboard/STATS

export const onExpensesWritten = onDocumentWritten("companies/{companyId}/expenses/{expenseId}",
    async (event) => {

        const companyId = event.params.companyId;
        await generateGraphDataInvoiceExpenses(companyId);

    });

export const onInvoiceWritten = onDocumentWritten("companies/{companyId}/invoice/{invoiceId}",
    async (event) => {

        const companyId = event.params.companyId;
        await generateGraphDataInvoiceExpenses(companyId);

    });


async function generateGraphDataInvoiceExpenses(companyId: string) {
    const expensesData = await getAllSubCollectionDocs<Expenses>(companyId, 'expenses');
    const invoiceData = await getAllSubCollectionDocs<Invoice>(companyId, 'invoices');

    const currentMonth = getCurrentMonth();
    console.log('currentMonth', currentMonth);
    const data = calculateMonthlyTotals(expensesData, invoiceData, currentMonth);


    const docRef = admin.firestore()
        .collection('companies')
        .doc(companyId)
        .collection('dashboard')
        .doc('STATS');

    console.log('about to complete function', data);
    await docRef.set({
        graphInvoiceExpenses: {
            labels: data.labels,
            expenses: data.expenseData,
            invoices: data.invoiceData
        }
    }, {merge: true});
}