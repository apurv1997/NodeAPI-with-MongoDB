// Required libraries
const express = require("express");
const res = require("express/lib/response");
//Import the Model directory and model.js file in routes.js
const Model = require("../model/model");
/**
 * The express.Router() function is used to create a new router object.
 * This function is used when you want tob create a new router object
 * in your program to handle requests.
 */
const router = express.Router();

// JavaScript library of crypto standards.
// Importing sha256, hmacSHA256, Base64.
const sha256 = require("crypto-js/sha256");
const hmacSHA256 = require("crypto-js/hmac-sha256");
const Base64 = require("crypto-js/enc-base64");

// middleware function
const middleware = function (req, res, next) {
  console.warn("current route is: ", req.originalUrl);

  console.log(req.headers.hash);

  let hmacDigest = "";
  /* Base64:
   * Base64 is a group of binary-to-text encoding schemes that represent binary data
   * in sequences of 24 bits that can be represented by four 6-bit Base64 digits.
   *
   * hmacSHA256:
   * The output hash is 256 bits in length.
   * An HMAC can be used to determine whether a message sent over an insecure channel
   * has been tampered with, provided that the sender and receiver share a secret key.
   *
   * JSON.stringify():
   * A common use of JSON is to exchange data to/from a web server.
   * When sending data to a web server, the data has to be a string.
   * Convert a JavaScript object into a string with JSON.stringify().
   */
  hmacDigest = Base64.stringify(hmacSHA256(JSON.stringify(req.body), "12345"));
  console.log(hmacDigest);

  //comparing header hash value with hmacSHA(JSON.stringify()).
  if (req.headers.hash == hmacDigest) {
    next();
  } else {
    res.status(400).json("Hash is not matched");
  }
};
//call the middleware function.
router.use(middleware);

//Post Method
/**
 * The req.body property contains key-value pairs of data submitted in the request body. 
 * By default, it is undefined.
 * We enter the values in the key-value pair enter the data into the database. 
 */
router.post("/save_errorlog", async (req, res) => {
  const data = new Model({
    UniqueID: req.body.UniqueID,
    ClientID: req.body.ClientID,
    Source: req.body.Source,
    ErrorMsg: req.body.ErrorMsg,
    Date: req.body.Date,
    MethodName: req.body.MethodName,
    RoomID: req.body.RoomID,
    GameID: req.body.GameID,
  });

  // using try-catch block to handle success messages and errors.
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get Method
/**
 * In get method we are giving the values of 4 parameters:
 * clientID, pageno, _fromdate, _todate.
 * We set a limit of 5 that means every page containes the 5 data value pairs.
 */
router.post("/get_errorlog", async (req, res) => {
  try {
    var limit = 5;
    var clientID = req.body.clientid;
    var pageno = req.body.pageno;
    var _fromdate = req.body.Fromdate;
    var _todate = req.body.Todate;

    // Calculate skip and limit with PageNo and Size. Assign to the JSON Object.
    var limino = (pageno - 1) * limit;

    /**
     * $gte selects the documents where the value of the field is  >= a specified value.
     * $lte selects the documents where the value of the field is <= the specified value.
     * The .toISOString() method returns a string in simplified extended ISO format, 
     * which is always 24 or 27 characters long (YYYY-MM-DDTHH:mm:ss.sssZ)
     */
    const clientid = await Model.find({
      ClientID: clientID,
      Date: {
        $gte: new Date(_fromdate).toISOString(),
        $lte: new Date(_todate).toISOString(),
      },
    })
      .limit(5)
      .skip(limino);

    console.log(clientID);
    console.log(pageno);
    console.log(_fromdate);
    console.log(_todate);

    // Return the clientid or send the error message. 
    const data = await Model.find();
    res.json(clientid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
