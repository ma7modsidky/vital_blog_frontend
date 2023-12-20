import React from 'react'
import postimg from '../../assets/imgs/unavailable-image.jpg'
import './posts.scss'
import {Link} from "react-router-dom"

export default function PostFeatured(props) {
    
    return (
        <div className='PostFeatured'>
            <div className="PostFeatured__img">
                {props.data.image?
                <img src={props.data.image} alt="post image" />:
                <img src={postimg} alt="post image" />
                }
            </div>
            <div className="PostFeatured__info">
                <Link to={"/post/" + props.data.id} >
                    <h3>{props.data.title}</h3>
                    <p className='PostFeatured__info_brief'>{props.data.brief}</p>
                    <p><span>{props.data.author}</span> - <span>{props.data.updated}</span></p>
                </Link>
            </div>
            
        </div>
        
    )
}
