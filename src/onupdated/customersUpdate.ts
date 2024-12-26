import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';




interface CustomerData {
    name: string;
    companyName: string;
    email: string;
    address: string;
    state: string;
    workphone: string;
    amountReceivable: number;
    totalAmountPaid: number;
    contactPerson: string;
}


export const customerUpdatedFunc = onDocumentUpdated('companies/{companyId}/customers/{customerId}', async (event) => {
const companyid=event.params.companyId;
    const oldValue = event.data.before.data() as CustomerData;
    const newValue = event.data.after.data() as CustomerData;


    const changes = detectChanges(oldValue, newValue);

    if (changes.length > 0) {

        console.log(`Customer updated: ${changes.join(', ')}`);

        try {
            await updateRelatedDocuments('expenses',companyid, event.params.customerId, newValue);
            await updateRelatedDocuments('invoices',companyid, event.params.customerId, newValue);
        } catch (error) {
            console.error('Error updating related documents:', error);
        }
    }

    return null;
});


const detectChanges = (oldValue: CustomerData, newValue: CustomerData): string[] => {
    const changes: string[] = [];

    if (oldValue.name !== newValue.name) changes.push(`Name changed from ${oldValue.name} to ${newValue.name}`);
    if (oldValue.companyName !== newValue.companyName) changes.push(`Company Name changed from ${oldValue.companyName} to ${newValue.companyName}`);
    if (oldValue.email !== newValue.email) changes.push(`Email changed from ${oldValue.email} to ${newValue.email}`);
    if (oldValue.address !== newValue.address) changes.push(`Address changed from ${oldValue.address} to ${newValue.address}`);
    if (oldValue.state !== newValue.state) changes.push(`State changed from ${oldValue.state} to ${newValue.state}`);
    if (oldValue.workphone !== newValue.workphone) changes.push(`Work Phone changed from ${oldValue.workphone} to ${newValue.workphone}`);
    if (oldValue.amountReceivable !== newValue.amountReceivable) changes.push(`Amount Receivable changed from ${oldValue.amountReceivable} to ${newValue.amountReceivable}`);
    if (oldValue.totalAmountPaid !== newValue.totalAmountPaid) changes.push(`Total Amount Paid changed from ${oldValue.totalAmountPaid} to ${newValue.totalAmountPaid}`);
    if (oldValue.contactPerson !== newValue.contactPerson) changes.push(`Contact Person changed from ${oldValue.contactPerson} to ${newValue.contactPerson}`);

    return changes;
};

const updateRelatedDocuments = async (collectionName: string,companyid:string,  customerId: string, newCustomerData: CustomerData) => {
    const collectionRef = admin.firestore().collection("companies").doc(companyid).collection(collectionName);
    const querySnapshot = await collectionRef.where('customer.id', '==', customerId).get();

    if (querySnapshot.empty) {
        console.log(`No documents found in ${collectionName} for customer ID ${customerId}`);
        return;
    }

    const updateData = querySnapshot.docs.map(async (doc) => {
        const docRef = collectionRef.doc(doc.id);
        try {
            await docRef.update({
                customer:{  ...newCustomerData,id:doc.id}
            });
            console.log(`Updated ${collectionName} document with customer ID ${customerId}`);
        } catch (error) {
            console.error(`Error updating document with customer ID ${customerId} in ${collectionName}:`, error);
        }
    });

    await Promise.all(updateData);
};
