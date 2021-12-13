const { PubSub } = require("@google-cloud/pubsub");
const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
projectId = "dynamic-mystery-328723";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

db.settings({
  timestampsInSnapshots: true,
});

router.post("/:id", async (req, res) => {
  var userid = req.params.id;
  console.log(userid);
  var message = req.body.message;
  console.log(message);

  var boxid;
  var tmp = [];
  index = 0;
  try {
    const box = db.collection("Box");
    box.get().then(async function (col) {
      col.forEach(async function (doc) {
        arr = doc.data().members;
        arr.forEach(async (user) => {
          if (user == userid) {
            boxid = doc.id;
            console.log(boxid);
            const pubsub = new PubSub({
              keyFilename: "serviceAccountKey.json",
            });
            console.log("hello");
            if(!(doc.data().pubsub)){
              const topicName = boxid.slice(2,7)
              console.log(topicName)
              const subscriptionName = boxid.slice(2,7)
              const [topic] = await pubsub.createTopic(topicName)
              console.log("pub")
              const [subscriber] = await topic.createSubscription(subscriptionName);
              console.log("subpub")
              topic.publish(Buffer.from(message));
              await db.collection('Box').doc(doc.id).set({
                pubsub:true,
                sentby:userid,
                message:message
                }, { merge: true });
              res.status(200).json({
                result: "sucess",
                message,
                success: true
            })
            }
            else{
              subscriptionName = boxid.slice(2,7)
              const topic = pubsub.topic(subscriptionName);
                const sub =await pubsub.topic(subscriptionName).subscription(subscriptionName)
                await sub.on('message',async message => {
                  message= await message.data.toString()
                  console.log(message)
                })
                await db.collection('Box').doc(doc.id).set({
                    message:message,
                    pubsub:false,
                    sentby:userid
                    }, { merge: true });
                res.status(200).json({
                    result: "sucess",
                    message,
                    success: true
                })

              
             
               console.log('Received message:', message);
               await topic.publish(Buffer.from(message));
            
            }
          }else {
            tmp[index] = user;
            index++;
          }
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
});

router.get("/:id", async (req, res) => {
  var userid = req.params.id;
  var boxid;

  index = 0;
  try {
    const box = db.collection("Box");
    box.get().then(async function (col) {
      col.forEach(async function (docs) {
        arr = docs.data().members;
        arr.forEach(async (user) => {
          if (user == userid) {
            const result = docs.data().balance;
                    const disp = docs.data().message;
                    const sent = docs.data().sentby;
                    res.status(200).json({
                        message: "sucess",
                        result,
                        disp,
                        sent,
                        success: true
            });
          }
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
});

router.put("/:id", async (req, res) => {
  var userid = req.params.id;
  var amount = req.body.amount;
  var boxid;

  index = 0;
  try {
    const box = db.collection("Box");
    box.get().then(async function (col) {
      col.forEach(async function (docs) {
        arr = docs.data().members;
        arr.forEach(async (user) => {
          if (user == userid) {
            const bal = docs.data().balance;
            const result = bal - amount;
            await db.collection("Box").doc(docs.id).set(
              {
                balance: result,
              },
              { merge: true }
            );
            res.status(200).json({
              message: "sucess",
              result,
              success: true,
            });
          }
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
});

module.exports = router;
