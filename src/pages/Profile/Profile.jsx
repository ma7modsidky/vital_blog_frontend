import React, {useContext , useState, useEffect, useMemo} from 'react'
import userimg from '../../assets/imgs/no_profile_picture.webp'
import './profile.scss'
import AuthContext from '../../context/AuthContext'
import axiosInstance from '../../axios';
import {
  Link
} from "react-router-dom";


function ProfileInfo({user}) {
    return (
        <div className=' profile_info'>
            <div className='profile_info_img'>
                {user.image? 
                <img src={user.image} alt="profile_image" />:
                <img src={userimg} alt="empty profile image" />
                }
            </div>
            <div className='profile_info_text'>
                <h3>{user.first_name} {user.last_name}</h3>
                <p>{user.about}</p>
                <Link to="/profile/edit" className='btn'>Edit information</Link>
            </div>
            
        </div>
    )
}


function ProfileHistory(props) {
    let {posts, setData } = props
    function handleDelete(e){
        
        axiosInstance
        .delete(`/${e.target.attributes.postid.value}/`)
        .then(res=> {
            setData({'posts': posts ,dataIsReturned : false})
            let newList = posts.filter((post)=> post.id !== e.target.attributes.postid.value)
            setData({'posts' : newList, dataIsReturned : true})
            console.log('succesfully deleted')
        })
        .catch(err => console.log(err.response))
    }
    return (
        <div className='profile_history'>
            {posts?
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Last Edit</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {posts.map((post, index)=> (
                    <tr key={index}>
                        <td><Link to={"/post/" + post.id}> {post.title}</Link></td>
                        <td>{post.updated}</td>
                        <td><Link to={"/edit_post/" + post.id}
                        className='btn'
                        hi={post.id}
                        >Edit</Link><a className='btn rm' onClick={handleDelete} postid={post.id}>Delete</a></td>
                    </tr>  
                ))}
                </tbody>
        
            </table>
            :null}
           
        </div>
    )
}



function Profile() {
    const {user ,setUser} = useContext(AuthContext)
    
    const [data, setData] = useState({posts:[], dataIsReturned: false ,});
    const [userData, setUserData] = useState({user:null ,dataIsReturned: false});
    useEffect(()=>{
        axiosInstance
        .get(`user/posts/`)
        .then(res=> {
            setData({'posts' : res.data, dataIsReturned:true})
        })
        .catch(err => console.log(err.response))
    },[data.dataIsReturned])
    useEffect(()=>{
        axiosInstance
        .get(`user/${user.user_id}/`)
        .then(res=> {
            console.log('fetching dataS')
            setUser({...user, image:res.data.image})
            setUserData({user:res.data, dataIsReturned:true})
        })
        .catch(err => {
            console.log(err)
        })

    },[])
    return (
        // <div className='profile'>
        //     <Routes>
        //         <Route  path="/profile/" exact>
        //             <>
        //             <h1>Your Profile</h1>
        //             {userData.dataIsReturned?
        //             <ProfileInfo user={userData.user}/>:
        //             <p>loading</p>
        //             }
        //             <h2>Your Posts ({data.posts.length}) <Link to='/new_post' className='btn' style={{float:'right',margin:'0', backgroundColor:'green'}}>New Post</Link></h2> 
        //             {data.dataIsReturned?
        //             <ProfileHistory posts={data.posts} setData={setData}/>:
        //             <p>loading</p>
        //             }
        //             </>
        //         </Route>
        //         <Route  path ="/profile/edit" params={{user:userData.user}}>
        //             <>
        //             <h1>Edit Your Profile</h1>
        //             <ProfileEdit/>
        //             </>
        //         </Route>
                
        //     </Routes>
               
        // </div>
        <div className='profile'>
                    <>
                    <h1>Your Profile</h1>
                    {userData.dataIsReturned?
                    <ProfileInfo user={userData.user}/>:
                    <p>loading</p>
                    }
                    <h2>Your Posts ({data.posts.length}) <Link to='/new_post' className='btn' style={{float:'right',margin:'0', backgroundColor:'green'}}>New Post</Link></h2> 
                    {data.dataIsReturned?
                    <ProfileHistory posts={data.posts} setData={setData}/>:
                    <p>loading</p>
                    }
                    </>
        </div>
        
    )
}

export default Profile
