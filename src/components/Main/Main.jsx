import Login from "../../pages/Login/Login";
import Home from "../../pages/Home/Home";
import Profile from "../../pages/Profile/Profile";
import ProfileEdit from "../../pages/Profile/ProfileEdit";
import "./main.scss";

import { Routes, Route } from "react-router-dom";
import PostDetail from "../Post/PostDetail";
import PostForm from "../Post/PostForm";
import PostEditForm from "../Post/PostEditForm";
import PostList from "../../pages/PostList/PostList";
import NotFound from "../../pages/NotFound/NotFound";
import CategoryList from "../../pages/Category/CategoryList";
import Layout from "../Layout";
import RequireAuth from "../RequireAuth";

// This component is responsible for routing and is rendered in the app component with the header and footer

export default function Main() {

  return (
    <main className="main">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route path="/about" />
          <Route path="/login" element={<Login />} />
          <Route path="/category_list/" element={<CategoryList />} />
          <Route path="/category/:categoryName" element={<PostList />} />
          <Route path="/" exact element={<Home />} />
          <Route path="/notfound" element={<NotFound />} />

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new_post" element={<PostForm />} />
            <Route path="/edit_post/:id" element={<PostEditForm />} />
            <Route path="/post/:postId" exact element={<PostDetail />} />
          </Route>
          {/* Catch all  */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </main>
  );
}
