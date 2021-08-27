import React ,{useState,useEffect}from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Redirect } from 'react-router';


export default function App() {
  
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Login">Login</Link>
          </li>
          <li>
            <Link to="/Register">Register</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/Login">
            <Login />
          </Route>
          <Route path="/Register">
            <Register />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

async function login (username,password,setRedirect){
  var data = {
    username:username,
    password:password
  }
  const response = await fetch('http://localhost:8070/login',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body:JSON.stringify(data)
    })
  const res = await response.json();      
  if(res.error){
    console.log('error');
  }else{
    console.log("logged in");
    setRedirect(true);
  }
}

function Login() {
  const [username, setUserame] = useState("username");
  const [password, setPassword] = useState("password");
  const [redirect, setRedirect] = useState(false);
  return (
    <div>
      <h2>username</h2>
      <input value={username} onChange={(e)=>setUserame(e.target.value)}></input>
      <h2>password</h2>
      <input value={password} onChange={(e)=>setPassword(e.target.value)}></input>

      <button onClick={()=>login(username,password,setRedirect)} >login</button>
      {redirect && <Redirect to='/dashboard' />}
    </div>
  );
}

async function register (username,password,setRegisterbutton){
  var data = {
    username:username,
    password:password
  }
  const response = await fetch('http://localhost:8070/register',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body:JSON.stringify(data)
    })
  const res = await response.json();      
  if(res.error){
    console.log("error");
  }else{
    console.log("registered");
    setRegisterbutton("Registered");
  }
}

function Register() {
  const [username, setUserame] = useState("username");
  const [password, setPassword] = useState("password");
  const [registerbutton, setRegisterbutton] = useState("Register");
  return (
    <div>
      <h2>username</h2>
      <input value={username} onChange={(e)=>setUserame(e.target.value)}></input>
      <h2>password</h2>
      <input value={password} onChange={(e)=>setPassword(e.target.value)}></input>
      <button onClick={()=>register(username,password,setRegisterbutton)} >{registerbutton}</button>
    </div>
  );
}

function Dashboard() {
  const [userdata, setUserdata] = useState("not logged in");
  const [username, setUsername] = useState("");
  useEffect(()=>{async function fetchdata ()  {     
    const response = await fetch('http://localhost:8070/userdata',{
      method:'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
    const res = await response.json(); 
    if(res.error){
      setUserdata("error");
    }else{
      setUserdata(res.userdata);
      setUsername(res.username);
    }
    
    };
    fetchdata();},[]);
    const update =async()=>{
      const response = await fetch('http://localhost:8070/userdata',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body:JSON.stringify({userdata:userdata})
    })
    const res = await response.json();      
    if(res.error){
    console.log("error");
    }else{
    console.log("updated");
    }
    }
  return (
    <div>
      <h2>Dashboard {username}</h2>
      <h2>{userdata}</h2>
      <input value={userdata} onChange={(e)=>setUserdata(e.target.value)}></input>
      <button onClick={update}>update</button>
    </div>
  );
}
