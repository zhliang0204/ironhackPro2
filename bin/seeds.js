// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Food = require("../models/Food");
const Message = require("../models/Message");


const bcryptSalt = 10;

mongoose
  .connect('mongodb://localhost/foodshare', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

let users = [
  {
    username: "alice",
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
    
  },
  {
    username: "bob",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
  
  }
]

let foods = [
  {
    name:"Chole Bature",
    cuisine:"indian",
    description:"lots of foods can be eaten by 2-3 people"

  }
]

let message = [
  {
    content : "i want this food",
    sender: "Binu",
    receiver:"rahul"
  },
]

User.create(users)
  .then(users =>
    console.log(`Created ${users.length} users`)
  )
Food.create(foods)
  .then(foods =>
    console.log(`Created ${foods.length} foods`)
  )
Message.create(message)
  .then(message =>
    console.log(`Created ${message.length} message`)
  )

User.deleteMany()
.then(() => {
  return User.create(users)
})
.then(usersCreated => {
  console.log(`${usersCreated.length} users created with the following id:`);
  console.log(usersCreated.map(u => u._id));
})
.then(() => {
  // Close properly the connection to Mongoose
  mongoose.disconnect()
})
.catch(err => {
  mongoose.disconnect()
  throw err
})