import React, { useEffect , useState} from 'react'
import axiosInstance from '../../axios';
import PostFeatured from '../../components/Post/PostFeatured'
import PostWrapper from '../../components/Post/PostWrapper'

function Home() {
    const [data, setData] = useState({posts:[], dataIsReturned: false ,});
    
    useEffect(() =>{
        axiosInstance
        .get(`posts`)
        .then((res) => {
            setData({'posts' : res.data, 'featured': res.data[0] , dataIsReturned : true})
        })
        
        .catch(err => {
            setData({posts:[], dataIsReturned: false})
            console.log('Error loading posts')
            console.log(err)
        }
        )
    },[])
    
    let { dataIsReturned, posts , featured } = data;

    return (
      <div className="Home">
        {dataIsReturned ? (
          <div>
            {featured && (
              <>
                <h2 className='PostWrapper_title'>Featured Post</h2>
                <PostFeatured data={featured} />
              </>
            )}
            <PostWrapper title="latest posts" posts={posts} />
          </div>
        ) : (
          <p>Loading, Please wait a second ...</p>
        )}
      </div>
    );
}

export default Home
