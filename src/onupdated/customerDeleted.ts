import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

export const customerDeletedFunc = onDocumentDeleted('companies/{companyId}/customers/{customerId}', async (event) => {
    const companyid = event.params.companyId;
    const customerId = event.params.customerId;

    try {
        // Delete related data in expenses and invoices collections
        await deleteRelatedDocuments('expenses', companyid, customerId);
        await deleteRelatedDocuments('invoices', companyid, customerId);
    } catch (error) {
        console.error('Error deleting related documents:', error);
    }

    return null;
});

const deleteRelatedDocuments = async (collectionName: string, companyid: string, customerId: string) => {
    const collectionRef = admin.firestore().collection("companies").doc(companyid).collection(collectionName);
    const querySnapshot = await collectionRef.where('customer.id', '==', customerId).get();

    if (querySnapshot.empty) {
        console.log(`No related documents found in ${collectionName} for customer ID ${customerId}`);
        return;
    }

    const batch = admin.firestore().batch();

    querySnapshot.docs.forEach((doc) => {
        const docRef = collectionRef.doc(doc.id);
        batch.delete(docRef);
    });

    try {
        await batch.commit();
        console.log(`Successfully deleted ${querySnapshot.size} documents in ${collectionName}`);
    } catch (error) {
        console.error(`Error deleting documents in ${collectionName}:`, error);
    }
};
