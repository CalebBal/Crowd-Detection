const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



exports.updateCount = functions.https.onRequest(async (req, res) => {
    const collectionRef = admin.firestore().collection('rooms');

    console.log('MESSAGE RECEIVED');
    console.log(req.body);

    if (!req.body.roomID && !req.body.count) {
        res.sendStatus(404);
        return;
    }

    const qSnap = await collectionRef.where('roomID', '==', req.body.roomID).get();
    if (qSnap.docs.length === 0) {
        res.json({ error: 404, message: `Unable to find document with id: ${req.body.roomID}` });
        return;
    }
    const docID = qSnap.docs[0].id;
    await collectionRef.doc(docID).set(req.body);

    res.sendStatus(200);
});