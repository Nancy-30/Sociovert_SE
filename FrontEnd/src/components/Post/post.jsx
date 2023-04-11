import { MoreVert } from "@mui/icons-material"
import "./post.css"
import axios from "axios";
import {useContext, useEffect, useState } from "react";
import {format} from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


export default function Post({post}) {
  const [like,setLike] =useState(post.likes.length)
  const [isliked,setisLiked] =useState(false);
  const [user,setUser] =useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user:currentUser} = useContext(AuthContext);

  useEffect(() => {
    setisLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(()=>{
    const fetchUser = async () => {
      console.log(post.userId);
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser(); 
  },[post.userId]);

  const likeHandler =()=>{
    try{
      axios.put("/posts/" + post._id + "/like", {userId:currentUser._id } )
    }catch(err){}
    setLike(isliked ? like-1 : like+1);
    setisLiked(!isliked)
  }
  return (
    <div className="post">
    <div className="postWrapper">
    <div className="postTop">
    <div className="postTopLeft">
    <Link to= {`/profile/${user.username}`}>
    <img className="postProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF+"Persons/noAvatar.png"} alt=""/>
    </Link>
    <span className="postUsername">{user.username}</span>
    <span className="postDate">{format(post.createdAt)}</span>
    </div>
    <div className="postTopRight">
    <MoreVert />
    </div>
    </div>
    <div className="postCenter">
    <div className="postText">{post?.desc}</div>
    <img className = "postImg" src={PF+post.img} alt=""/>
    </div>
    <div className="postBottom">
    <div className="postBottomLeft">
    <img className="likeIcon" src={`${PF}like.png`}  onClick={likeHandler} alt=""/>
    <span className="postLikeCounter">{like} likes</span>
    </div>
    <div className="postBottomRight">
    <span className="postCommentText">{post.comment} comments</span>
    </div>
    </div>
    </div>
    </div>
  )
}
