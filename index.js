// Required Libraries.
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes")

// MongoDB URL.
const url = `mongodb+srv://users:users123@cluster0.6vrgh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// Connection Parameters for MongoDB.
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//Connecting Mongoose with URL and connection parameters  
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to MongoDB Database successfully!");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

// transfer the contents of Express into a new constant called app.
const app = express();

app.use(express.json());
app.use('/api', routes)

// Server establish on portno: 3000.
app.listen(3000, () => {
  console.log(`Server started at ${3000}`);
});
