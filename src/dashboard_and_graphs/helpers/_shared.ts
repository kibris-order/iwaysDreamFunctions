import * as admin from "firebase-admin";

export function getCurrentMonth() {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentDate = new Date();

// Get the current month's full name
    return monthNames[currentDate.getMonth()];


}


export async function getAllSubCollectionDocs<T>(companyId: string, collectionName: string, customerId?: string) {
    try {
        const expensesCollection = admin.firestore()
            .collection('companies')
            .doc(companyId)
            .collection(collectionName)

        console.log('We a re in collection', companyId, collectionName, customerId);

        let snapshot;
        if (customerId) {
            snapshot = await expensesCollection
                .where('customer.id', '==', customerId)
                .get();
        } else {
            snapshot = await expensesCollection.get();
        }


        if (snapshot.empty) {
            console.log("No matching documents found in " + collectionName + " collection.");
            return [];
        }

        console.log(collectionName, " documents found are:", snapshot.docs.length);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as T));
    } catch (error) {
        console.error("Error fetching " + collectionName + ":", error);
        throw error;
    }
}

