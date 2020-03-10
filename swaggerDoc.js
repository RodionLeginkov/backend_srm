const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
const routes = require("./routes")
const options = {
  swaggerDefinition: {
    info: {
      title: "Exceed team API",
      description: "end point information",
      contact: {
        name: "Backend"
      },
      servers: ["http://localhost:5000"]
    }
  },
  apis: ['./routes/project.js','./routes/users.js']
}

const specs = swaggerJsDoc(options);
module.exports = (app) => {
  app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(specs));
  app.use(routes);
  app.use(function(err,req,res,next){
    if (err.isBoom){
      return res.status(err.output.statusCode).json(err.output.payload)
    }
  })
}