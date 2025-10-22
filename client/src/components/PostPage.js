import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PostPage() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [comment, setComment] = useState('')

    useEffect(() => {
        // fetch post
        fetch(`http://localhost:5000/posts/${id}`)
            .then(res => res.json())
            .then(postData => {
                setPost(postData);
            });

        // fetch comments for this post
        fetch(`http://localhost:5001/comments/${id}`)
            .then(res => res.json())
            .then(commentsData => {
                setPost(prev => prev ? { ...prev, comments: commentsData } : { comments: commentsData });
            });
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await fetch(`http://localhost:5001/comments/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: comment })
        })

        if (res.ok) {
            const newComment = await res.json()
            setPost({
                ...post,
                comments: [...(post.comments || []), newComment]
            })
            setComment('')
        }
    }

    if (!post) return <p>Loading...</p>

    return (
        <div className="formBox">
            <h2>{post.title}</h2>
            <p>{post.content}</p>

            <h3>Comments</h3>
            {post.comments?.length ? (
                post.comments.map(c => <p key={c.id}>
                    {c.status === 'pending' && '[Awaiting moderation] '}
                    {c.status === 'rejected' && '[Kahjuks Rejected] '}
                    {c.status === 'approved' || c.status === 'pending' ? c.content : ''}
                   
                    </p>)
            ) : (
                <p>No Comments yet</p>
            )}

            <h4>Add Comment</h4>
            <form onSubmit={handleSubmit}>
                <input 
                type='text'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                />
                <button type="submit">Add</button>
            </form>
        </div>
    )
}