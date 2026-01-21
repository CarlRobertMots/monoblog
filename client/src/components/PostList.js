import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function PostList() {
    const [posts, setPosts] = useState([])

     useEffect(() => {
    const fetchPosts = async () => { 
      try {
        const res = await axios.get('/posts');
        const postsData = res.data;
        setPosts(postsData);
      } catch (err) {
        console.error('Error fetching posts:', err.message);
      }
    };

    fetchPosts();
  }, []);

  console.log(posts);

  
    return (
    <div>
        {posts.map(post => (
            <Link to={`/posts/${post.id}`} key={post.id}>
                <div className='displayBox'>
                    <h3 className='title'>{post.title}</h3>
                    {/* Muudetud post.content -> post.body */}
                    <p className='content'>{post.body}</p> 
                </div>
            </Link>
        ))}
       <div className="add-post-container">
            <Link to={'/add'}>
                <button>Add Post</button>
            </Link>
        </div>
    </div>
)
}