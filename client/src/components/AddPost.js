import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AppPost() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newPost = { title, content }

        const res = await fetch('http://localhost:5000/posts', {
            method :'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost),
        })

        if(res.ok) {
            setTitle('')
            setContent('')
            navigate('/')
        }

    }

    return (
        <>
            <div className='formBox'>
                <h2>Add a new Post</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title: </label>
                        <input 
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Content: </label>
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <div className='AddPostButton'>
                        <button type='submit'>Add Post</button>
                    </div>
                    
                </form>
            </div>
        </>
    )
}