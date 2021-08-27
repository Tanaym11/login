const express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 8070;

app.use(cors({credentials: true,origin: true}));
app.use(cookieParser());
app.use(express.json());
var mongoDB ='mongodb+srv://username123:hNhAbCKPjHiUrJYl@cluster0.pws1e.mongodb.net/testdb?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
const userSchema = new mongoose.Schema({
  name: String,
  passwordHash: String,
  userdata: String,
});
const User = mongoose.model('User', userSchema);


db.on('error', console.error.bind(console, 'MongoDB connection error:'));



app.post('/login', async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var user = await db.collection('users').findOne({'username':username});
  if(user && bcrypt.compareSync(password, user.passwordHash)){
    var token = jwt.sign({ username: user.username }, 'shhhhh', { expiresIn: '1h' });
    res.cookie('JWT', token,{httpOnly: true})
    res.send({message:'logged in'});
  }else{
    res.send({error:'error'});
  }
})

app.post('/register', async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var user = await db.collection('users').findOne({'username':username});
  if(user){
    res.send({error:'error'});
  }else{
    var passwordHash = bcrypt.hashSync(password, 10);
    var newUser = { username: username,passwordHash: passwordHash,userdata:""};
    await db.collection('users').insertOne(newUser);
    res.send({message:'registered'});
  }  
})

app.get('/userdata', async(req, res) => {
  var token = req.cookies.JWT;
  console.log(token);
  var bool=false;
  var err = true;
  if(token ){
    try {
      var decoded = jwt.verify(token, 'shhhhh');
      var username = decoded.username;
      bool=true;
    } catch(err) {
      console.log("error");
    }
  }
  if(bool){
    var user = await db.collection('users').findOne({'username':username});
    if(user){
      var newtoken = jwt.sign({ username: user.username }, 'shhhhh', { expiresIn: '1h' });
      res.cookie('JWT', newtoken,{httpOnly: true});
      res.send({userdata:user.userdata,username:user.username});
      err=false;
    }
  }
  if(err){
      res.send({error:'error'});
  }
})

app.post('/userdata', async(req, res) => {
  var userdata = req.body.userdata;
  var token = req.cookies.JWT;
  var bool=false;
  var err = false;
  if(token){
    try {
      var decoded = jwt.verify(token, 'shhhhh');
      var username = decoded.username;
      bool=true;
    } catch(err) {
      console.log("error")
    }
  }
  if(bool && userdata){
    var user = await db.collection('users').findOne({'username':username});
    if(user){
      var token = jwt.sign({ username: user.username }, 'shhhhh', { expiresIn: '1h' });
      res.cookie('JWT', token,{httpOnly: true});
      user.userdata = userdata;
      console.log(user);
      await db.collection('users').replaceOne({username:user.username},user);
      res.send({message:'userdata updated'});
      err = false;
    }
  }
  if(err){
      res.send({error:'error'});
  }
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})

