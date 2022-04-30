const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

// middale ware 
app.use(express.json())
app.use(cors())





const uri = "mongodb+srv://mamun:<password>@walton.sam03.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{
    await client.connect();
    const productCollection = client.db("walton-product").collection("product")

    // product data read to mongodb 
    app.get('/product' , async (req , res) =>{
      const query = {}
      const cursor = productCollection.find(query)
      const product = await cursor.toArray()
      res.send(product)
    })

  }
  finally{

  }
}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})