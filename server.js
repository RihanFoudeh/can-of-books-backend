'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const server = express();
server.use(cors());

const PORT = process.env.PORT;
server.use(express.json());
//MongoDB
const mongoose = require('mongoose');

let Modelbook;
main().catch(err => console.log(err));

async function main() {
    // await mongoose.connect('mongodb://localhost:27017/dataBooks');
    await mongoose.connect(process.env.MONGO_URL);


    const bookSchema = new mongoose.Schema({
        bookTitle: String,
        bookDescription: String,
        bookStatus: String,
        bookEmail: String

    });

    Modelbook = mongoose.model('book', bookSchema);

    //   seedData();
}

//seeding a data function 

async function seedData() {
    const Book1 = new Modelbook({

        bookTitle: 'The Da Vinci Code',
        bookDescription: 'While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night. The elderly curator of the Louvre has been murdered inside the museum, his body covered in baffling symbols. As Langdon and gifted French cryptologist Sophie Neveu sort through the bizarre riddles, they are stunned to discover a trail of clues hidden in the works of Leonardo da',
        bookStatus: 'Available',
        ownerEmail: 'Rihanfoudeh@gmail.com'
    });

    const Book2 = new Modelbook({
        bookTitle: 'Angels and Demons',
        bookDescription: 'Angels & Demons is a 2000 bestselling mystery-thriller novel written by American author Dan Brown and published by Pocket Books and then by Corgi Books. The novel introduces the character Robert Langdon, who recurs as the protagonist of Browns subsequent novels',
        bookStatus: 'Available',
        ownerEmail: 'Rihanfoudeh@gmail.com'
    });

    const Book3 = new Modelbook({
        bookTitle: 'The Lost Symbol',
        bookDescription: 'The Lost Symbol is a 2009 novel written by American writer Dan Brown. It is a thriller set in Washington, D.C., after the events of The Da Vinci Code, and relies on Freemasonry for both its recurring theme and its major characters',
        bookStatus: 'Available',
        ownerEmail: 'Rihanfoudeh@gmail.com'
    });


    await Book1.save();
    await Book2.save();
    await Book3.save();
}


//Routes
server.get('/', homeHandler);
server.get('/book', bookHandler);
server.post('/books', addBooks);
server.delete('/Books/:id', deleteBookHandler);
server.put('/updatebooks/:id',updatebookHandler);

//Functions Handlers
function homeHandler(req, res) {

    res.send('Home Page');
}

function bookHandler(req, res) {
    //send fav cats list (email)
    const email = req.query.email;
    Modelbook.find({ ownerEmail: email }, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    })
}




async function addBooks(req, res) {
    console.log(req.body);
    const bookTitle = req.body.bookTitle;
    const bookDescription = req.body.bookDescription;
    const bookStatus = req.body.bookStatus;
    const bookEmail = req.body.bookEmail;
    // const {bookTitle, bookDescription, bookStatus,bookEmail} = req.body;
    await Modelbook.create({
        bookTitle: bookTitle,
        bookDescription: bookDescription,
        bookStatus: bookStatus,
        bookEmail: bookEmail
    });

    // await KittenModel.create({catName,catBreed,ownerEmail});

    Modelbook.find({ ownerEmail: bookEmail }, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    })

}



function deleteBookHandler(req, res) {
    const bookId = req.params.id;
    const email = req.query.email;
    Modelbook.deleteOne({ _id: bookId }, (err, result) => {

        Modelbook.find({ ownerEmail: email }, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        })

    })


}



function updatebookHandler(req,res) {
    const id = req.params.id;
    // const email = req.query.email;
    const {bookTitle, bookDescription, bookStatus,bookEmail} = req.body;
    
    Modelbook.findByIdAndUpdate(id,{bookTitle,bookDescription,bookStatus,bookEmail},(err,result)=>{
        Modelbook.find({ownerEmail:bookEmail},(err,result)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.send(result);
            }
        })
    })
}


server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})


