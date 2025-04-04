import React, { useEffect } from 'react'
import './postList.css'
import Post from '../post/Post'
import { usePostStore } from '../../store/usePostStore'

export default function PostList() {

    const { getAllPosts, posts} = usePostStore();

    useEffect(()=>{
        getAllPosts();
    },[getAllPosts])

  return (
    <ul className='post-list'>
     {
        posts?.map((post) => {
            return <Post 
            key={post._id} 
            mediaArray={post.media} 
            description={post.description} 
            createdAt={post.createdAt}
            user={post.user}
            />
        })
     } 
    </ul>
  )
}
