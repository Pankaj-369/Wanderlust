// const mongoose = require("mongoose");
// const Listing = require("./models/listing"); // your Mongoose model
// const { data } = require("./init/seed");

// mongoose
//   .connect("mongodb+srv://Pankaj:Pankaj@cluster0.kfuh7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.log(err));

// const seedDB = async () => {
//   await Listing.deleteMany({});
//   await Listing.insertMany(data);
//   console.log("Database Seeded!");
// };

// seedDB().then(() => {
//   mongoose.connection.close();
// });


const User = require("./models/user");
// const user = await User.findOne({ username: "test" }); // or any existing user
initData.data = initData.data.map(obj => ({ ...obj, owner: "68601dfdba4fe5b11bc8961e"}));
