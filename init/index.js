const mongoose = require('mongoose');
const initData =require('./data.js');
const Listing = require('../models/listing.js');

main().then(()=>{
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust')
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,owner:"6857cad6a998559b1af7f4a2"}));
    await Listing.insertMany(initData.data);
    console.log("Successfully reinitialized");
}

initDB();