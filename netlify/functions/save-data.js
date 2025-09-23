const admin = require('firebase-admin');

const serviceAccount = {
  projectId: process.env.FIRESTORE_PROJECT_ID,
  clientEmail: process.env.FIRESTORE_CLIENT_EMAIL,
  privateKey: process.env.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { id, data } = JSON.parse(event.body);
    const docRef = db.collection('workbooks').doc(id);
    await docRef.set(data);

    return { statusCode: 200, body: JSON.stringify({ message: 'Data saved' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};