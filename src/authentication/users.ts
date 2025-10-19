import * as admin from 'firebase-admin';
import {HttpsError, onCall} from 'firebase-functions/v2/https';

interface DashboardStats {
    expensesAnalysis: {
        labels: string[],
        expenseCountData: number[],
        _totalAllCat: number
    },
    graphInvoiceExpenses: {
        labels: string [],
        expenses: number[],
        invoices: number[]
    },
    countTotal: {
        customers: number,
        invoices: number,
        paymentsReceived: number,
        salesReceipts: number,
        quotations: number,
        expenses: number,
    },
    amountTotals: {
        customers: number,
        invoices: number,
        paymentsReceived: number,
        salesReceipts: number,
        quotations: number,
        expenses: number,
    }
}

interface Company {
    id: string;
    name: string;
    logo: string;
    email: string;
    address: string;
    createdOn: string;
    updatedOn: string;
}

interface UnifiedInterface {
    user: {
        fullName: string;
        email: string;
        phoneNumber: string;
    };
    password: string;
    company: {
        id: string;
        name: string;
        logo: string;
        email: string;
        address: string;
    };
}

//turn this into a trigger

export const onUserSignUp = onCall(async (request) => {
    // Ensure the function is called by an authenticated user
    const data = request.data;

    try {


        const d = data as UnifiedInterface;

        const companyId = await createCompany(d.company);
        await createUsers(d.user, d.password, companyId);
        await createDashboard(companyId);
        return {status: 'success', message: 'we are all good!'};
    } catch (e) {
        return {status: 'error', message: e.message.toString()};
    }

});

async function createDashboard(companyId: string) {
    const initialDashboardStats: DashboardStats = {
        expensesAnalysis: {
            labels: [],
            expenseCountData: [],
            _totalAllCat: 0
        },
        graphInvoiceExpenses: {
            labels: [],
            expenses: [],
            invoices: []
        },
        countTotal: {
            customers: 0,
            invoices: 0,
            paymentsReceived: 0,
            salesReceipts: 0,
            quotations: 0,
            expenses: 0,
        },
        amountTotals: {
            customers: 0,
            invoices: 0,
            paymentsReceived: 0,
            salesReceipts: 0,
            quotations: 0,
            expenses: 0,
        }
    };
    await admin.firestore().collection('companies')
        .doc(companyId)
        .collection('dashboard')
        .doc('STATS').set({...initialDashboardStats}, {merge: true});

}

export async function createUsers(user: {
    fullName: string,
    email: string,
}, password: string, companyId: string) {

    const user1 = await admin.auth().createUser({
        displayName: user.fullName,
        email: user.email,
        password: password,
        photoURL: `https://ui-avatars.com/api/?name=${user.fullName.replace(" ", '+')}`,
    });

    await admin.auth().setCustomUserClaims(user1.uid, {companyId: companyId});

    console.log('User seeded correctly', user1.uid);

}

export async function createCompany(company1: {
    name: string,
    logo: string,
    email: string,
    address: string,
}) {

    const date = new Date().toDateString();

    const company = await admin.firestore().collection('companies').add({
        ...company1,
        counters: {
            invoices: 0,
            customers: 0,
            expenses: 0,
            payments: 0,
            salesReceipts: 0,
            quotations: 0

        },
        createdOn: date.toString(),
        updatedOn: date.toString()
    });
    return company.id;

}

export const createCustomToken = onCall(async (data, context) => {
    const idToken = data.data.idToken;
    if (!idToken) {
        throw new HttpsError('invalid-argument', 'idToken is required.');
    }

    try {
        // Verify the incoming ID token
        const decoded = await admin.auth().verifyIdToken(idToken);

        // Create a new custom token for that user
        const customToken = await admin.auth().createCustomToken(decoded.uid);

        return { customToken };
    } catch (error) {
        console.error('Error creating custom token:', error);
        throw new HttpsError('internal', 'Error creating custom token.');
    }
});