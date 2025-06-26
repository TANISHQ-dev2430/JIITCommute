const admin = require('firebase-admin');

// Parse the JSON from env variable
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

// Fix the private_key: convert \\n to actual \n
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
