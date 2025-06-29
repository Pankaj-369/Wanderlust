const mongoose = require('mongoose');
const initData =require('./data.js');
const Listing = require('../models/listing.js');

main().then(()=>{
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

async function main(){
    await mongoose.connect('mongodb+srv://Pankaj:Pankaj@cluster0.kfuh7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,owner:"68601dfdba4fe5b11bc8961e"}));
    await Listing.insertMany(initData.data);
    console.log("Successfully reinitialized");
}

initDB();