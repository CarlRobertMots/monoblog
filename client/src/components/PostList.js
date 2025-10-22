import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function PostList() {
    const [posts, setPosts] = useState([])

     useEffect(() => {
    const fetchPosts = async () => { 
      try {
        const res = await axios.get('http://localhost:5000/posts');
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
                <Link to={`/posts/${post.id}`}>
                    <div key={post.id} className='displayBox'>
                        <h3 className='title'>{post.title}</h3>
                        <p className='content'>{post.content}</p>
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