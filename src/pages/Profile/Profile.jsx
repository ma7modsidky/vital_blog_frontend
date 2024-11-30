import { useContext, useState, useEffect, useMemo } from "react";
import userimg from "../../assets/imgs/no_profile_picture.webp";
import "./profile.scss";
import AuthContext from "../../context/AuthContext";
import axiosInstance from "../../axios";
import { Link } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import ClipLoader from "react-spinners/ClipLoader";
import Pagination from "../../components/Pagination/Pagination";
function ProfileInfo({ user }) {
  return (
    <div className=" profile_info">
      <div className="profile_info_img">
        {user.image ? (
          <img src={user.image} alt="profile_image" />
        ) : (
          <img src={userimg} alt="empty profile image" />
        )}
      </div>
      <div className="profile_info_text">
        <h3>
          {user.first_name} {user.last_name}
        </h3>
        <p>{user.about}</p>
        <Link to="/profile/edit" className="btn">
          Edit information
        </Link>
      </div>
    </div>
  );
}

function ProfileHistory({ data, setData }) {
  const { openModal } = useModal();
//   let { posts, dataIsReturned } = data;
  function handleDelete(e) {
    const id = e.target.attributes.postid.value;
    console.log(id)
    axiosInstance
      .delete(`/posts/${e.target.attributes.postid.value}/`)
      .then((res) => {
        setData({...data, dataIsReturned: false})
        openModal("You successfully deleted the post");
      })
      .then(() => {
        console.log("test");
      })
      .catch((err) => console.log(err.response));
  }
  return (
    <div className="profile_history">
      {data.posts ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Last Edit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link to={"/post/" + post.id} className="post_title"> {post.title}</Link>
                </td>
                <td>{post.updated}</td>
                <td>
                  <Link
                    to={"/edit_post/" + post.id}
                    className="btn"
                    hi={post.id}
                  >
                    Edit
                  </Link>
                  <a className="btn rm" onClick={handleDelete} postid={post.id}>
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [data, setData] = useState({ posts: [], dataIsReturned: false });
  const [userData, setUserData] = useState({
    user: null,
    dataIsReturned: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    axiosInstance
      .get(`user/posts/?page=${currentPage}`)
      .then((res) => {
        setData({ posts: res.data.results, dataIsReturned:true });
        setTotalPages(Math.ceil(res.data.count / 6));
      })
      .catch((err) => console.log(err.response));
  }, [currentPage, data.dataIsReturned]);
  useEffect(() => {
    axiosInstance   
      .get(`user/${user.user_id}/`)
      .then((res) => {
        setUser({ ...user, image: res.data.image });
        setUserData({ user: res.data, dataIsReturned: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    // <div className='profile'>
    //     <Routes>
    //         <Route  path="/profile/" exact>
    //             <>
    //             <h1>Your Profile</h1>
    //             {userData.dataIsReturned?
    //             <ProfileInfo user={userData.user}/>:
    //             <p>loading</p>
    //             }
    //             <h2>Your Posts ({data.posts.length}) <Link to='/new_post' className='btn' style={{float:'right',margin:'0', backgroundColor:'green'}}>New Post</Link></h2>
    //             {data.dataIsReturned?
    //             <ProfileHistory posts={data.posts} setData={setData}/>:
    //             <p>loading</p>
    //             }
    //             </>
    //         </Route>
    //         <Route  path ="/profile/edit" params={{user:userData.user}}>
    //             <>
    //             <h1>Edit Your Profile</h1>
    //             <ProfileEdit/>
    //             </>
    //         </Route>

    //     </Routes>

    // </div>
    // posts={data.posts}
    <div className="profile">
      <>
        <h1>Your Profile</h1>
        {userData.dataIsReturned ? (
          <ProfileInfo user={userData.user} />
        ) : (
          <ClipLoader
            color="#364485"
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
        <h2>
          Your Posts ({data.posts.length}){" "}
          <Link
            to="/new_post"
            className="btn"
            style={{ float: "right", margin: "0", backgroundColor: "green" }}
          >
            New Post
          </Link>
        </h2>
        {data.dataIsReturned ? (
            <>
          <ProfileHistory data={data} setData={setData} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        ) : (
            <ClipLoader
            color="#364485"
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
      </>
    </div>
  );
}

export default Profile;
