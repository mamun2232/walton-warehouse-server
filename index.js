const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
var jwt = require('jsonwebtoken');
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
    const reviewCollection = client.db("customer").collection("review")

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
     
      const body = req.body
      console.log(body);
      const filter = {_id: ObjectId(id) }
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
   
      const body = req.body
      console.log(body);
      const filter = {_id: ObjectId(id) }
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
    app.post('/productOrder', async (req , res) =>{
      const order = req.body
      const tokenInfo = req.headers.authorization
      const [email, accussToken] = tokenInfo.split(" ")
      const decoded = verifay(accussToken)

      if(email == decoded.email){
        const result = await productCollection.insertOne(order)
      res.send({success: 'Product Added SuccessFul'})
        
      }
      else {
        res.send({ success: 'Unauthrize Access' })
      }
      
    })

    // my postet prduct read 
    app.get('/productOrder', async (req, res) => {
      const email = req.query.email
      const query = {email: email}
      const cursor = productCollection.find(query)
      const product = await cursor.toArray()
      res.send(product)
    })

    // crate jwt tocken 
    app.post('/login' , async (req , res)=>{
      const email = req.body
      console.log(email);
      const  accessToken = jwt.sign(email , process.env.ACCESS_TOKEN);
      res.send({accessToken})


    })

    // verifay email 
    const verifay = (token) => {
      let email;
      jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
          email = 'Unvalid Email'

        }
        if (decoded) {
          console.log(email);
          email = decoded
        }
      });
      return email

    }

    //  detet api 
    app.delete('/product/:id' , async (req , res) =>{
      const id = req.params.id
      const query = {_id : ObjectId(id)}
      const confrom = await productCollection.deleteOne(query)
      res.send(confrom)
    })


    // customer review data read 
    app.get('/customerReview', async (req, res) => {
      const query = {}
      const cursor = reviewCollection.find(query)
      const review = await cursor.toArray()
      res.send(review)
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