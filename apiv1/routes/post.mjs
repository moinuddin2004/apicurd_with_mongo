
import express from 'express';
import{client} from  '../../mongodb.mjs'
import { ObjectId } from 'mongodb';
let router = express.Router()

// not recommended at all - server should be stateless
// let posts = [
//     {
//         id: nanoid(),
//         title: "express()",
//         text: "By Sir Inzamam Malik"
//     }
// ]


const db = client.db("crud");
// Use the collection "people"
const col = db.collection("posts");


      



// POST    /api/v1/post
router.post('/post',async (req, res, next) => {
    console.log('This is create post request', new Date());

    if (
        (req.body.title.trim().length == 0) || (req.body.text.trim().length == 0)
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `);
        return;
    }
try{
    let newpost = {
        title: req.body.title,
        text: req.body.text,
     }
     const p = await col.insertOne(newpost );
     console.log(`insert${p}`);

    res.send('Post created');}
    catch(err) {
        console.error(err);
        res.status(500).send("server error")}
})
// GET     /api/v1/posts
router.get('/posts', async(req, res, next) => {
    const cursor =  col.find({});
 try{   console.log('This is all posts request!', new Date());
    let data =await cursor.toArray();
console.log(data);
    res.send(data);
}
catch(err)
{ console.error("error to get all"+err);
res.status(500).send("post id must be a valid number");
}
})

// GET     /api/v1/post/:postId
router.get('/post/:postId', async(req, res, next) => {
    console.log('this is specific post request!', new Date());

    if (!req.params.postId) {
        res.status(403).send(`post id must be a valid number, no alphabet is allowed in post id`)
    }

  
 try{  
    const filter = { _id: new ObjectId(req.params.postId) };
    const data = await col.findOne(filter);
    console.log('This is all posts request!', new Date());
    console.log(data);
    res.send(data);
    await client.close();
}
catch(err)
{ console.error("error to get all"+err);
res.status(500).send("post id must be a valid number");
await client.close();
}
})

// PUT     /api/v1/post/:userId/:postId
router.put('/post/edit/:postId',async (req, res, next) => {
//     console.log('This is edit! request', new Date());
//     if (
//         (req.body.title.trim().length == 0) || (req.body.text.trim().length == 0) ) {
//         res.status(403);
//         res.send(`required parameters missing, 
//         example request body:
//         {
//             title: "abc post title",
//             text: "some post text"
//         } `);
//         return;
//     }
//     // posts.forEach(post => {

//     //     if(post.id === req.params.postId){
//     //         post.title = req.body.title;
//     //         post.text = req.body.text;
            
//     //         return
//     //     }
    
//     // });


//     try{
//         await client.connect();
//         console.log("Connected Atlas");
//         const filter = { _id: new ObjectId(req.params.postId) };
//         const updateDoc = {

//             $set: {
    
//             title: req.body.title,
//             text: req.body.text
    
//             },
    
//         };
//         const result = await col.updateOne(filter, updateDoc);
//         console.log("Updated"+result)
//         res.send('Post Edited successfully');
//         await client.close();
//         console.log("Disconnected Atlas");
// }
// catch (err){

//     console.log(err);
//     res.send('Error Not Found: ' + err);


// }


//     // res.send('Post Edited successfully');
// })

try {
    const postId = req.params.postId;

    if (
        (req.body.title.trim().length === 0) || (req.body.text.trim().length === 0)
    ) {
        res.status(400).json({ error: 'Title and text must not be empty' });
        return;
    }

    const filter = { _id: new ObjectId(postId) };
    const updateDoc = {
        $set: {
            title: req.body.title,
            text: req.body.text
        }
    };

    const result = await col.updateOne(filter, updateDoc);

    if (result.matchedCount === 1) {
        res.json({ message: 'Post edited successfully' });
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
}
});


// DELETE  /api/v1/post/:userId/:postId
router.delete('/post/delete/:postId',async (req, res, next) => {
//     console.log('This is delete! request', new Date());

//     // posts.forEach((post, index) => {

//     //     if (post.id === req.params.postId) {

//     //         posts.splice(index, 1);

//     //         return

//     //     }

//     // })

    
//     // res.send('Post deleted successfully');

//     try{

//         await client.connect();
//         console.log("Connected Atlas");

//         const query = { _id: new ObjectId(req.params.postId)};

//         const result = await col.deleteOne(query);

//         if (result.deletedCount === 1) {

//             console.log("Successfully deleted one document.");
      
//           } else {
      
//             console.log("No documents matched the query. Deleted 0 documents.");
      
//             }


//         await client.close();
//         console.log("Disconnected Atlas");

//     res.send('Post deleted successfully');


//     }


//     catch (err) {

//         res.send('Error Not Found: ' + err.message);
//     }
    


// })

// export default router


try {
    const postId = req.params.postId;
    const query = { _id: new ObjectId(postId) };

    const result = await col.deleteOne(query);

    if (result.deletedCount === 1) {
        res.json({ message: 'Post deleted successfully' });
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
}
});

export default router;






