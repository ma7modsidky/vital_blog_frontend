import React from 'react'

import {Link} from "react-router-dom"
import './posts.scss'
import postimg from '../../assets/imgs/unavailable-image.jpg'

export default function PostWrapper({title , posts , limit=6}) {
    return (
        
        <div className='PostWrapper'>
            <h2 className='PostWrapper_title'>{title}</h2>
            {posts && posts.length>0?
            <div className="PostWrapper_body">
                {posts.slice(0,limit).map((post,index) => (
                    <Link to={"/post/" + post.id} className='gridItem' key={index}>
                        <div className="post">
                            <div className="post_img">
                                {post.image?
                                <img src={post.image} alt="post image" />:
                                <img src={postimg} alt="no post image" />
                                }
                            </div>
                            <div className="post_info">
                                <h3 className='post_title'>{post.title}</h3>
                                <p  className='post_body'>{post.brief}</p>
                                <p><span className='post_author'>{post.author}</span> - <span className='post_date'>{post.updated}</span></p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>:
            <div>no posts</div>}
            {posts && posts.length>6?
            
            <div className="btn_more">
                <a rel="noopener noreferrer">More</a>
            </div>:
            null
            }
        </div>
    )
}
