import {useContext, useState, useEffect , useRef} from 'react'
import AuthContext from '../../context/AuthContext'
import axiosInstance from '../../axios';
import { useParams, useNavigate  } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react';
import { useModal } from '../../context/ModalContext';

function PostEditForm() {
    const {openModal} = useModal()
    const navigate = useNavigate()
    const {id} = useParams()
    const {user} = useContext(AuthContext)
    const [data,setData] = useState({dataIsReturned : false})
    const [value, setValue] = useState('');
    const [Image, setImage] = useState(null);
    const [ImageURL, setImageURL] = useState(null);
    const [msg, setMsg] = useState(null);
    const editorRef = useRef(null);
    useEffect(()=>{
        axiosInstance
        .get(`/posts/${id}/`)
        .then((res) => {
            setValue(res.data.body)
            setData({post: res.data , dataIsReturned : true})
            setImageURL(res.data.image)
        })
        .catch(error => console.log(error.response.status , error.response.statusText)) 
    },[id])
    
    function goBack(){
      navigate(-1)
    }
    
    function handleImageChange(e){
        setImage(e.target.files[0])
        setImageURL(URL.createObjectURL(e.target.files[0]))
        
    }
    function handleChange(e){
        setData({
                ...data,
                post:{
                    ...data.post,
                    [e.target.name]: e.target.value
                }
            });
            console.log(data)
    }
    function handleSubmit(e){
        e.preventDefault()
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
           }
        let fdata = new FormData()
        fdata.append('title', data.post.title)
        fdata.append('brief', data.post.brief)
        fdata.append('body', value)
        fdata.append('status', data.post.status)
        fdata.append('author', user.user_id)
        if(Image){
            fdata.append('image', Image)
        }
        console.log(fdata.toString())
        axiosInstance
        .patch(`posts/${data.post.id}/`, fdata, config)
        .then(res=>{
            openModal('Post updated succesfully')
            setMsg('Post updated succesfully')
            goBack()
            
        })
        .catch(err => {
            setMsg(err.message.toString())
        })
        
    }
    console.log('PostEditForm')
    return (
        <div className='PostForm'>
            <h1>Edit Post</h1>
            {data.dataIsReturned?
            <form action="">
                <label htmlFor="title" >Title</label>
                <input type="text" id="title" name='title'  value={data.post.title} onChange={handleChange}/>

                <label htmlFor="brief">Brief</label>
                <input type="text" id="brief" name='brief'  value={data.post.brief} onChange={handleChange}/>

                <label htmlFor="body">Body</label>
                <Editor apiKey='e3imfuv0cshwiv1eq7qcoas55jbeuxvkm2ou9u4xslchymow'
                  onInit={(evt, editor) => editorRef.current = editor}
                  initialValue={value}
                  id='body'
                  onEditorChange={(newValue, editor) => setValue(newValue)}
                  init={{
                    height: 500,
                    menubar: 'file edit view insert format tools table help',
                    // plugins: [
                    //   'advlist autolink lists link image charmap print preview anchor',
                    //   'searchreplace visualblocks code fullscreen',
                    //   'insertdatetime media table paste code help wordcount'
                    // ],
                    toolbar: 'undo redo | formatselect | color ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    
                  }}
                  
                />

                <label htmlFor="Image">Post Image</label>
                <input type="file" name='Image' id='Image' accept='image/*' onChange={handleImageChange}/>
                {Image?
                <img src={ImageURL} alt="post image" />:
                <img src={data.post.image} alt="post image"/>
                }
                {msg?
                <div className='msg' style={{color:'green'}}>{msg}</div>:
                null}
                <a className='btn' onClick={handleSubmit}>Submit</a>
                <a className='btn' onClick={goBack} >Back</a>
            </form>:
            <p>loading</p>}
            
        </div>
    )
}

export default PostEditForm
