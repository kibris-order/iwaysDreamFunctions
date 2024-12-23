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

export const onUserSignUp = onCall(async (data, context) => {
    try {
       /* const data: UnifiedInterface = {
            user: {
                fullName: 'Musa Jahun',
                email: 'mjahun@gmail.com',
                phoneNumber: '08093446914',
            },
            password: 'Ims2024#',
            company: {
                id: 'company1',
                name: 'Arewa Textile Kaduna Ltd',
                logo: '/arewa-text-logo2.png',
                email: 'arewax34@gmail.com',
                address: 'No. 15 Sabongari, Zaria, Kaduna',
            },
        };*/
        const d = data.data as UnifiedInterface;

        const companyId = await createCompany(d.company);
        await createUsers(d.user, d.password, companyId);

        return {status: 'success'};
    } catch (e) {
        return {status: 'error'};
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