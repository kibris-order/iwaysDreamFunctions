import * as admin from 'firebase-admin';
import {HttpsError, onCall} from 'firebase-functions/v2/https';

export const createCustomToken = onCall(async (data, context) => {
    const idToken = data.data.idToken;
    if (!idToken) {
        throw new HttpsError('invalid-argument', 'idToken is required.');
    }

    try {  // Create a new custom token for that user
        // Verify the incoming ID token
        const decoded = await admin.auth().verifyIdToken(idToken);


        const customToken = await admin.auth().createCustomToken(decoded.uid);

        return { customToken };
    } catch (error) {
        console.error('Error creating custom token:', error);
        throw new HttpsError('internal', 'Error creating custom token.');
    }
});