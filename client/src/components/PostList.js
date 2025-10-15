import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PostList() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch('http://localhost:5000/posts')
        .then(res => res.json())
        .then(data => setPosts(data));
    }, [])

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