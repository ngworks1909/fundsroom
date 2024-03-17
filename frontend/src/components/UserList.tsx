import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import '../css/UserList.css';
import { UserState } from '../states/UserState';
import UserItem from './UserItem';

export interface User{
    userId: string,
    username: string,
    mobile: string
}
export default function UserList() {
    const [userlist, setUserList] = useState([]);
    const loading = useRecoilValue(UserState);
    const setLoading = useSetRecoilState(UserState);
    const user = localStorage.getItem('username');
    const username = `${user?.charAt(0).toUpperCase()}${user?.substring(1)}`
    useEffect(() => {
        setLoading(true);
        fetch(`https://backend.nithin-kanduru1908.workers.dev/api/auth/getUsers`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token") || ""
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
    <div className="user-list-wrapper">
        <div className='user-list display-flex flex-column'>
        <TypeAnimation sequence={[`Hello ${username} !!!`,2000,""]} speed={30} wrapper="h2" repeat={Infinity} />
        <div className="user-list-seperation display-flex flex-column gap-10">
        <h5>Pay Friends</h5>
        {loading && <span>Loading...</span>}
        {!loading && userlist.map((user: User, index) => {
            return <UserItem user = {user}  key={index} />
        })}
        </div>
    </div>
    </div>
  )
}
