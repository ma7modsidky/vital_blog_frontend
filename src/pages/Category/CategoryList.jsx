import { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function CategoryList() {
  let [data, setData] = useState({ categories: [], dataIsReturned: false });
  useEffect(function(){
    axiosInstance
    .get(`categories`)
    .then(res=>{
        setData({categories:res.data, dataIsReturned:true})
        
    })
    .catch(err=>{
        console.log(err)
    })
},[])

  return (
    <div className="PostWrapper">
      <h2 className="PostWrapper_title">All Categories</h2>
      {data.dataIsReturned ? 
      <div className="PostWrapper_body">
        {data.categories.map((category,index)=> (
            <Link to={"/category/" + category.name} className='gridItem' key={index}>
            <div className="post">
                <h3 className='category'>{category.name}</h3>
            </div>
        </Link>
        ))}
        </div>
      : <ClipLoader
        
      color='#364485'
      size={50}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
      }

    </div>
  );
}

export default CategoryList;
