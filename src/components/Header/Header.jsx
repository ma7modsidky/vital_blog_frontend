import React, { useEffect, useState , useContext} from 'react'
import logo from '../../assets/imgs/logo.png'
import {Link} from 'react-router-dom'

import './header.scss'
import AuthContext from '../../context/AuthContext'
import axiosInstance from '../../axios'

export default function Header() {
	let {user , logout} = useContext(AuthContext)
	let [data, setData] = useState({categories:[],dataIsReturned:false})
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
		<header className="header">
			<div className="header__top">
				<div className="header__logo">
					<img src={logo} alt="logo" />
				</div>
				<a  id="btnHamburger" className="header__toggle">
					<span></span>
					<span></span>
					<span></span>
				</a>
			</div>
			<nav className="header__bottom">
				<ul className='categories'>
				<li ><Link to={`/category_list/`}>All</Link></li>
				{data.dataIsReturned?
					data.categories.slice(0,5).map((item)=>(
						<li key={item.id}><Link to={`/category/${item.name}`}>{item.name}</Link></li>
					))
				:
				null
				}
				
				</ul>
				{user?
				<ul>
					<li style={{color:'white'}}><Link to="/profile">Welcome {user.username}</Link></li>
					<li><Link to="/">Home</Link></li>
					<li onClick={logout}><a>Logout</a></li>
				</ul>:
				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/login">Login</Link></li>
				</ul>
				}		
			</nav>
		</header>
	);
}
