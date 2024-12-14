import * as admin from 'firebase-admin';

export async function setUserInFirestore(userRecord: any) {
    const userCollection = userRecord.providerData.length > 0 ? admin.firestore().collection('Users') :
        admin.firestore().collection('TEMPORARY_USERS');
    return userCollection.doc(userRecord.uid).set({...userRecord}, {merge: true})
        .then(ref => {
            console.log('updated user with id', userRecord.uid);
        })
        .catch(() => console.log('error in syncing user'));
}


export async function getUserByEmail(email: string) {
    return admin.auth().getUserByEmail(email);
}


export async function getAllUsers() {
    let users: any[] = [];
    let pageToken: any = null;
    return admin.auth().listUsers(1000)
        .then(async function (listUsersResult) {
            users.push(...listUsersResult.users);
            pageToken = listUsersResult.pageToken;
            while (pageToken) {
                await admin.auth().listUsers(1000, pageToken)
                    .then(function (listUsersResult) {
                        pageToken = listUsersResult.pageToken;
                        users.push(...listUsersResult.users);
                    });
            }
            return users;
        });
}

export async function getAllAdminUsers() {
    const users = await getAllUsers();
    return users.filter(u => u.customClaims && u.customClaims.admin && u.customClaims.admin === true);
}
