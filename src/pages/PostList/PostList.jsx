import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import PostWrapper from '../../components/Post/PostWrapper'
import axiosInstance from '../../axios';
import Pagination from '../../components/Pagination/Pagination';
function PostList(props) {
    const [data, setData] = useState({posts:[], dataIsReturned: false ,});
    const {categoryName} = useParams()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const handlePageChange = (page) => {
      setCurrentPage(page)
    }
    useEffect(()=>{
        axiosInstance
        .get(`posts/?category__name=${categoryName}&page=${currentPage}`)
        .then(res=>{
            setData({'posts' : res.data.results, dataIsReturned : true})
            setTotalPages(Math.ceil(res.data.count / 6))
        })
        .catch(err=>{
            console.log(err)
        })
    },[categoryName,currentPage ])
    return (
        <div>
            {data.dataIsReturned &&
            <>
             <PostWrapper title={`${categoryName.toUpperCase()} Posts`} posts={data.posts}/>
             <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
             </>
            }
        </div>
    )
}

export default PostList
