//trigger: on update invoices, expenses
//on invoices, expenses
// create/update

//all invoices, all expenses, where customer.id === customerid
//call our aggregation helper method
//update companies/{companyId}/customer/{customerId}

import {onDocumentWritten} from "firebase-functions/v2/firestore";
import {Expenses, Invoice} from "../shared/models";
import {generateSalesExpensesPerCustomerGraph} from "./helpers/_graph-sales-expenses-per-customer.helper";
import {getAllSubCollectionDocs} from "./helpers/_shared";
import * as admin from "firebase-admin";

export const onExpensesWritten = onDocumentWritten("companies/{companyId}/expenses/{expenseId}",
    async (event) => {

        const document = event.data.after.data() as Expenses;
        const companyId = event.params.companyId;

        if(document?.customer){
            const customerId = document?.customer.id;

            await generateCustomerGraph(companyId, customerId);
        }


    });

export const onInvoiceWritten = onDocumentWritten("companies/{companyId}/invoices/{invoiceId}",
    async (event) => {
        const document = event.data.after.data() as Invoice;
        const companyId = event.params.companyId;
        const customerId = document?.customer.id;
        await generateCustomerGraph(companyId, customerId);
        // perform more operations ...
    });


async function generateCustomerGraph(companyId: string, customerId: string) {
    console.log('we are in generate customer graph beginning')
    if (customerId) {
        console.log('cusomer condition passes')
        const expensesData = await getAllSubCollectionDocs<Expenses>(companyId, 'expenses', customerId);
        const invoiceData = await getAllSubCollectionDocs<Invoice>(companyId, 'invoices', customerId);


        const data = generateSalesExpensesPerCustomerGraph(customerId, expensesData, invoiceData);

        console.log('data')
        const docRef = admin.firestore()
            .collection('companies')
            .doc(companyId)
            .collection('customers')
            .doc(customerId);

        await docRef.set({
            graphIncomeExpense: {
                labels: data.labels,
                expenses: data.expenseData,
                invoices: data.invoiceData
            }
        }, {merge: true});
    }
}