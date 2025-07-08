const express = require('express');
require("./config/database")
const app = express();


app.use("/",(req,res)=>{
  res.send("Hello");

})
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});