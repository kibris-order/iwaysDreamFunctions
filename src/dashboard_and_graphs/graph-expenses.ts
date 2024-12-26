import {onDocumentWritten} from "firebase-functions/v2/firestore";
import * as admin from 'firebase-admin';
import {Expenses} from "../shared/models";
import {generateGraphData} from "./helpers/_graph-expenses.helper";
import {getAllSubCollectionDocs} from "./helpers/_shared";


//trigger:// companies/{companyId}/expenses/{expenseId}
//what to do: getCompanyId, if null do nothing, and then run the aggrigation of expense analysis and update document
//where to save:  companies/{companyId}/dashboard/STATS


export const onExpenseWritten = onDocumentWritten("companies/{companyId}/expenses/{expenseId}",
    async (event) => {

        const companyId = event.params.companyId;
        //const data = event.data.after.data() as Expenses;

        const expensesData = await getAllSubCollectionDocs<Expenses>(companyId, 'expenses');
        //get all expenses
        const data = generateGraphData(expensesData);

        const docRef = admin.firestore()
            .collection('companies')
            .doc(companyId)
            .collection('dashboard')
            .doc('STATS');

        await docRef.set({expensesAnalysis: data}, {merge:true});

    });

