import React, {useContext, useState, useRef} from 'react'
import { Editor } from '@tinymce/tinymce-react';
import AuthContext from '../../context/AuthContext'
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom'

function PostForm() {
    const navigate = useNavigate()
    function goBack(){
      navigate(-1)
    }
    const {user} = useContext(AuthContext)
    const initialFormData = Object.freeze({
		title: '',
		brief: '',
        status: 'published',
        author: user.user_id,
	});
    const editorRef = useRef(null);
    const [formData, updateFormData] = useState(initialFormData);
    const [value, setValue] = useState('');
    const [Image, setImage] = useState(null);
    const [msg, setMsg] = useState(null);
    function handleImageChange(e){
        setImage(e.target.files[0])
  
    }
    function handleChange(e){
        updateFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
    }
    function handleSubmit(e){
        e.preventDefault()
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
           }
        let fdata = new FormData()
        fdata.append('title', formData.title)
        fdata.append('brief', formData.brief)
        fdata.append('body', value)
        fdata.append('status', formData.status)
        fdata.append('author', formData.author)
        if(Image){
            fdata.append('image', Image)
        }
        console.log(fdata)
        axiosInstance
        .post(`posts/`, fdata, config)
        .then(res=>{
            console.log(res)
            goBack()
        })
        .catch(err => {
            console.log(err)
            setMsg('Something went wrong please try again later')
        })
        
    }
    return (
        <div className='PostForm'>
            <h1>Create New Post</h1>
            {msg?
            <div>err{msg}</div>:
            null}
            <form action="">
                <label htmlFor="title" >Title</label>
                <input type="text" id="title" name='title' onChange={handleChange} value={formData.title}/>

                <label htmlFor="brief">Brief</label>
                <input type="text" id="Brief" name='brief' onChange={handleChange}/>

                <label htmlFor="Body">Body</label>
                <Editor apiKey='e3imfuv0cshwiv1eq7qcoas55jbeuxvkm2ou9u4xslchymow'
                  onInit={(evt, editor) => editorRef.current = editor}
                  initialValue={value}
                  id='Body'
                  onEditorChange={(newValue, editor) => setValue(newValue)}
                  init={{
                    height: 500,
                    menubar: 'file edit view insert format tools table help',
                    toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    
                  }}
                  
                />
                <label htmlFor="Image">Post Image</label>
                <input type="file" name='Image' id='Image' accept='image/*' onChange={handleImageChange}/>
                <a className='btn' onClick={handleSubmit}>Submit</a>
                <a className='btn' onClick={goBack} >Back</a>
            </form>
        </div>
    )
}

export default PostForm
