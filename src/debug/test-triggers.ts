import {onDocumentWritten} from "firebase-functions/lib/v2/providers/firestore";
import {getAllSubCollectionDocs} from "../dashboard_and_graphs/helpers/_shared";
import {Expenses} from "../shared/models";
import {generateGraphData} from "../dashboard_and_graphs/helpers/_graph-expenses.helper";
import * as admin from "firebase-admin";

export const onExpenseWritten = onDocumentWritten("companies/{companyId}/{collectionNme}/{expenseId}",
    async (event) => {

        const companyId = event.params.companyId;
        const collectionName = event.params.collectionNme;
        const expenseId = event.params.expenseId;


        console.log({companyId, collectionName, })



    });