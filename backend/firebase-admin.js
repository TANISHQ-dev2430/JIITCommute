const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_ADMIN_KEY) {
  serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
} else {
  serviceAccount = require('./serviceAccountKey.json'); 
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
