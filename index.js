const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middale ware 
app.use(express.json())
app.use(cors())





const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWOERD}@walton.sam03.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const productCollection = client.db("walton-product").collection("product")

    // product data read to mongodb 
    app.get('/product', async (req, res) => {
      const query = {}
      const cursor = productCollection.find(query)
      const product = await cursor.toArray()
      res.send(product)
    })

    // product details data load 
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id

      const query = { _id: ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    // update Quentity to incrase
    app.put('/product/:id', async (req, res) => {
      const id = req.params
      console.log(id);
      const body = req.body
      console.log(body);
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const update = {
        $set: {
          quentity: body.newQuentity

        }
      }
      const result = await productCollection.updateOne(filter, update, options);
      res.send({ success: 'Your Deliver SuccessFul' })
    })

    // update quentity to added 
    app.put('/products/:id', async (req, res) => {
      const id = req.params
      console.log(id);
      const body = req.body
      console.log(body);
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const update = {
        $set: {
          quentity: body.newQuentity

        }
      }
      const result = await productCollection.updateOne(filter, update, options);
      res.send({ success: 'Thank You , Quentity added' })
    })

    // post product 

    app.post('/product' , async(req , res) =>{
      const product = req.pody
      const result = await productCollection.insertOne(product)
      res.send({success: 'Product Added SuccessFul'})
    })

  }
  finally {

  }
}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})