import React, {useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { UserState } from '../states/UserState';
import UserItem from './UserItem';
import '../css/UserList.css'
import {TypeAnimation} from 'react-type-animation'


export default function UserList() {
    const [userlist, setUserList] = useState([]);
    const loading = useRecoilValue(UserState);
    const setLoading = useSetRecoilState(UserState);
    useEffect(() => {
        setLoading(true);
        fetch(`https://backend.nithin-kanduru1908.workers.dev/api/auth/getUsers`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token")
                }
        }).then(async(response) => {
            const {success, userslist} = await response.json();
            if(success){
                setUserList(userslist)
            }
            setLoading(false);
        })
    }, [setLoading])
  return (
    <div className='user-list display-flex flex-column'>
        <TypeAnimation sequence={["Hello User",2000,""]} speed={30} wrapper="h2" repeat={Infinity} />
        <div className="user-list-seperation display-flex flex-column gap-10">
        <h5>Pay Friends</h5>
        {loading && <span>Loading...</span>}
        {!loading && userlist.map((user, index) => {
            return <UserItem user = {user}  key={index} />
        })}
        </div>
    </div>
  )
}
