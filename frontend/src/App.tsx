import './App.css';
// import Navbar from './components/Navbar';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Account from './components/Account';
import CreateAccount from './components/CreateAccount';
import Pay from './components/Pay';
import Pin from './components/Pin';
import Refunds from './components/Refunds';
import Success from './components/Success';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { LogState } from './states/LogState';



function App() { 
  const [loading,setLoading] = useState(true);
  const logState = useRecoilValue(LogState);
  const setLogState = useSetRecoilState(LogState);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
       setLogState(true);
    }
    setLoading(false);
  }, [setLogState])
  return (
    <Router>
      <Routes>
        <Route  path='/'  element={loading? "loading": logState? <Home/>: <Login/>}></Route>
        <Route  path='/login'  element={<Login/>}></Route>
        <Route  path='/register' element={<Register/>}></Route>
        <Route  path='/refunds' element={<Refunds/>}></Route>
        <Route  path='/account' element={<Account/>}></Route>
        <Route  path='/pay' element={<Pay/>}></Route>
        <Route  path='/pin' element={<Pin/>}></Route>
        <Route path='/success' element= {<Success/>}></Route>
        <Route path='/createAccount' element= {<CreateAccount/>}></Route>
      </Routes>
     </Router>

  );
}

export default App;
