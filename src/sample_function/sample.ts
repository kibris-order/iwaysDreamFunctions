import {onDocumentCreated, onDocumentDeleted} from "firebase-functions/v2/firestore";

export const onUserCreated = onDocumentCreated("users/{userId}", (event) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    const data = snapshot.data() as { name: string, age: string };

    // access a particular field as you would any JS property
    const name = data.name;

    // perform more operations ...
});


export const onUserDeleted = onDocumentDeleted("users/{userId}", (event) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const userId  = event.params.userId;
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    //const data = snapshot.data() as { name: string, age: string };

    // access a particular field as you would any JS property
   // const name = data.name;

    console.log("We have deleted user with id ",userId )
    // perform more operations ...
});