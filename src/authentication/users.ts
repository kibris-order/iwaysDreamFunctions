import * as admin from 'firebase-admin';
import {onCall} from 'firebase-functions/v2/https';

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

        return {status: 'success', message: 'we are all good!'};
    } catch (e) {
        return {status: 'error', message: e.message.toString()};
    }

});


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
        createdOn: date.toString(),
        updatedOn: date.toString()
    });
    return company.id;

}