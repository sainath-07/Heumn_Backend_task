const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const CustomErrors = require('./utils/customErrors')
const handleGlobalErrors = require('./utils/handleGlobalErrors')
const userAuthRouter = require('./routes/userAuthRouter')
const bookRouter = require('./routes/bookRouter')
const borrowbook = require('./routes/borrowBookRouter')


const app = express()


// connection to database:
mongoose.connect(process.env.MONGODB_URL)
  .then(x => console.log('Connected to database'))
  .catch(error => console.log(error, "Error at database connection"))


// middleWare :
app.use(express.json());


// endPoints :
app.use('/users', userAuthRouter)
app.use('/books', bookRouter)
app.use('/', borrowbook)


app.all("*", (req, res, next) => {
  const error = new CustomErrors(
    `cant find ${req.originalUrl} on the server`,
    404
  );
  next(error);
});
app.use(handleGlobalErrors);

// server connection :
app.get('/', (req, res) => {
  res.send('root page')

})
const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`server is running at port : ${port}`)
})