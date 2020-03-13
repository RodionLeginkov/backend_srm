const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Exceed team API",
      description: "end point information",
      contact: {
        name: "Backend"
      }
    },
    servers:[
      {
        url:'http://localhost:5000/',
        description: "Local server",basePath: "/"
      },
      {
        url: 'https://black-list-crm.herokuapp.com/',
        description: "Heroku server", basePath: "/"
      }
    ],
    host: "localhost:5000",
    basePath: "/",
    schemes: 
    -"http"
    -"https"
  },
  // ['.routes/*.js']
  apis: ['./routes/project.js','./routes/users.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(cors({ origin : '*'}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const usersRouter = require("./routes/users")
const projectRouter = require("./routes/project")

app.use(((req,res,next) =>{
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}))
app.use("/users", usersRouter);
app.use("/project", projectRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
