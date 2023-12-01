const express = require('express');
const router = express.Router();
const firebase = require('firebase-admin');
const db = require('../modules/dbOps/firebasedb').dbAdmin.database();




// API endpoint to send a new message
router.post('/send-message', (req, res) => {
    const { recipient, message, sender } = req.body;



    // Save the message to the Firebase database
    const newMessageRef = db.ref().push({
        recipient,sender,
        message
    });

    res.json({
        success: true,
        messageId: newMessageRef.key
    });
});

// API endpoint to retrieve a user's inbox
router.get('/inbox/:userId', (req, res) => {
    const { userId } = req.params;

    // Retrieve the user's inbox from the Firebase database
    db.ref('messages')
        .orderByChild('recipient')
        .equalTo(userId)
        .once('value')
        .then(snapshot => {
            const messages = [];

            snapshot.forEach(childSnapshot => {
                const message = childSnapshot.val();
                message.messageId = childSnapshot.key;
                messages.push(message);
            });

            res.json({
                success: true,
                messages
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                error: error.message
            });
        });
});

module.exports = router;
