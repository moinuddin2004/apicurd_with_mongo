
import{ MongoClient, ServerApiVersion } from'mongodb';
 const uri = "mongodb+srv://syedmoinuddin:moin1234@cluster0.iiql1rp.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch(err){
    console.log(err.stack);
    await client.close();
    process.exit(1);
  }
  finally {
    // Ensures that the client will close when you finish/error
   

  }
}
run().catch(console.dir);


