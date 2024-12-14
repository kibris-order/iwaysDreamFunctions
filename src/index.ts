import * as admin from "firebase-admin";

admin.initializeApp();
admin.firestore().settings({ignoreUndefinedProperties: true});
exports.sample_function = require("./monitoring-app/submitted_data_app");
