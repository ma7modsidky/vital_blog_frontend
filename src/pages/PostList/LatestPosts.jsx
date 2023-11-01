import React ,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import PostWrapper from '../../components/Post/PostWrapper'
import axiosInstance from '../../axios';
function PostList(props) {
    // const [data, setData] = useState(null);
    const [data, setData] = useState({posts:[], dataIsReturned: false ,});
    const {categoryName} = useParams()
    useEffect(()=>{
        axiosInstance
        .get(`posts/?category__name=${categoryName}`)
        .then(res=>{
            setData({'posts' : res.data, dataIsReturned : true})
            // setData(res.data)
            console.log(data.posts)
        })
        .catch(err=>{
            console.log(err)
        })
    },[categoryName])
    return (
        <div>
            {data.dataIsReturned &&
             <PostWrapper title={`${categoryName.toUpperCase()} Posts`} posts={data.posts}/>
            }
        </div>
    )
}

export default PostList
