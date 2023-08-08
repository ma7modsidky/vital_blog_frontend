import React, {useContext} from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import axiosInstance from '../../axios';
import userimg from '../../assets/imgs/no_profile_picture.webp'


function ProfileEdit() {
    const {user, setUser} = useContext(AuthContext)
    const navigate = useNavigate()

    const initialFormData = Object.freeze({
		first_name: user.first_name,
		last_name: user.last_name,
        about: user.about,
    
	});
    const [formData, updateFormData] = useState(initialFormData);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoURL, setProfilePhotoURL] = useState(`${user.image}`);
    const [msg, setMsg] = useState(null);

    function goBack(){
        navigate(-1)
    }

    function handleSubmit(e){
        e.preventDefault();
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
           }
        let fdata = new FormData()
        fdata.append('first_name', formData.first_name)
        fdata.append('last_name', formData.last_name)
        fdata.append('about', formData.about)
        if(profilePhoto){
            fdata.append('image', profilePhoto)
        }

        axiosInstance
        .patch(`user/update_user/${user.user_id}/`, fdata, config)
        .then(res => {
            setUser({...user,
            'about': res.data['about'],
            'first_name': res.data['first_name'],
            'last_name' : res.data['last_name'] ,
            'profile_image': res.data['image'],
            'image': res.data['image'],})
            goBack()
            
        })
        .catch(err => {
            console.log(err)
            setMsg(err)
        })
    }
    function handleChange(e){
        if(e.target.name === 'about'){
            updateFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
        }else{
            updateFormData({
                ...formData,
                [e.target.name]: e.target.value.trim(),
            });

        }
        
        
    }
    function handlePhotoChange(e){
        setProfilePhoto(e.target.files[0])
        let file = e.target.files[0];
        let url = URL.createObjectURL(file)
        setProfilePhotoURL(url)
        
    }
    return (
        <div className='profile_edit'>
            <div className='profile_photo'>
                {user.image?
                <img src={profilePhotoURL} alt='new_profile_photo'></img>:
                <img src={userimg} alt='new_profile_photo'></img>}
            </div>
            <form>
                <label htmlFor="profile_photo">Profile photo</label>
                <input type="file" id="profile_photo" accept='image/*' onChange={handlePhotoChange}/>
                <div>
                    <label htmlFor="user_name">Username</label>
                    <input type="text" name='user_name' disabled id='user_name' value={user.username}/>
                </div>
                <div>
                    <label htmlFor="first_name">First name</label>
                    <input type="text" name='first_name' id='first_name' onChange={handleChange} value={formData.first_name}/>
                </div>
                <div>
                    <label htmlFor="last_name">Last name</label>
                    <input type="text" name='last_name' id='last_name' onChange={handleChange} value={formData.last_name}/>
                </div>
                <div>
                    <label htmlFor="about">About</label>
                    <textarea type="text" name='about' id='about' onChange={handleChange} rows='5' value={formData.about}/>
                </div>
                
                <a className='btn' onClick={handleSubmit}>Update</a>
            </form>
            <a onClick={goBack} className='btn'>Back</a>
            {msg?
            <p className='msg'>{msg.response.data}</p>:null}
        </div>
        
    )
}

export default ProfileEdit
