import { useEffect , useState } from 'react'
import axiosInstance from '../../axios';
import PostFeatured from '../../components/Post/PostFeatured'
import PostWrapper from '../../components/Post/PostWrapper'
import Pagination from '../../components/Pagination/Pagination';
import ClipLoader from "react-spinners/ClipLoader";

function Home() {
    const [data, setData] = useState({posts:[], dataIsReturned: false ,});
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const handlePageChange = (page) => {
      setCurrentPage(page)
    }
    useEffect(() =>{
        axiosInstance
        .get(`posts/?page=${currentPage}`)
        .then((res) => {
            setData({'posts' : res.data.results, 'featured': res.data.results[0] , dataIsReturned : true})
            setTotalPages(Math.ceil(res.data.count / 6))
        })
        
        .catch(err => {
            setData({posts:[], dataIsReturned: false})
            console.log('Error loading posts')
            console.log(err)
        }
        )
    },[currentPage])
    
    let { dataIsReturned, posts , featured } = data;
    
    return (
      <div className="Home">
        {dataIsReturned ? (
          <div>
            {featured && (currentPage == 1) && (
              <>
                <h2 className='PostWrapper_title'>Featured Post</h2>
                <PostFeatured data={featured} />
              </>
            )}
            <PostWrapper title="latest posts" posts={posts} limit={6} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        ) : (
          <ClipLoader
        
        color='#364485'
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
        )}
      </div>
    );
}

export default Home
