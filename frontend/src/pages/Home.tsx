import { useEffect } from 'react'
import UserList from '../components/UserList'
import Navbar from '../components/Navbar'
import {useNavigate} from 'react-router-dom'
import '../css/Home.css'

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
     fetch(`https://backend.nithin-kanduru1908.workers.dev/api/account/fetchAccount`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "auth-token":localStorage.getItem('token') || ""
                }
      }).then(async(response) => {
        const json = await response.json();
        if(!json.success){
          navigate("/createAccount");
        }
      })
  }, [navigate])
  return (
    <div className='home'>
      <Navbar/>
      <div className="place-middle">
      <UserList/>
      </div>
    </div>
  )
}
