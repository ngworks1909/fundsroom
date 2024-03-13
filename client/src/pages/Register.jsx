import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import '../css/Login.css';


export default function Register() {
  const navigate = useNavigate();
  const [err,setErr] = useState(false);
  const [msg,setMsg] = useState('');
  
  const handleRegister= async (e) =>{
        e.preventDefault();
        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const mobile = e.target[3].value;
        const response = await fetch(`https://backend.nithin-kanduru1908.workers.dev/api/auth/createUser`, {
        method: "POST",
        headers: {
              "Content-Type": "application/json",
            },
        body: JSON.stringify({username, email, password, mobile}),
        });
        const json = await response.json();
        if(json.success){
          const {token} = json;
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
          navigate("/");
        }
        else{
          setErr(true);
          setMsg(json.error);
          setTimeout(() => {
            setErr(false);
            setMsg('');
          }, 3000);
        }
  }
  return (
    <>
    {err && <Alert type={'danger'} message={msg}/>} 
     <div className="container-2 display-flex align-center justify-center">
       <div className="login display-flex align-center flex-column">
           <h2 className='login-h2'>Register</h2>
           <form onSubmit={handleRegister} className="login-form display-flex flex-column">
                <div className="form-floating mb-3">
                   <input type="text" className="form-control" id="floatingInput-1" placeholder="name" minLength={3} required/>
                   <label  htmlFor="floatingInput-1">Username</label>
                </div>
                <div className="form-floating mb-3">
                   <input type="email" className="form-control"  id="floatingInput-2" placeholder="name@example.com" required/>
                   <label htmlFor="floatingInput-2">Email address</label>
                </div>
                <div className="form-floating">
                  <input type="password"  className="form-control" id="floatingPassword" placeholder="Password" minLength={5} required/>
                  <label  htmlFor="floatingPassword">Password</label>
                </div>
                <div className="form-floating mt-3">
                  <input type="password"  className="form-control" id="floatingMobile" placeholder="Mobile" minLength={10} maxLength={10} required/>
                  <label  htmlFor="floatingPassword">Mobile</label>
                </div>
                <input type="submit" className="btn btn-primary signup-submit" value={"Register"}/>
           </form>
         
           <span className='not-user display-flex'>Already a user?<Link to="/login">Login</Link></span>
       </div>
     </div>
    </>
  )
}