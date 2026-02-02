import React, { useState } from "react";
import axios from "axios";

export default ({ postId }) => {
    const [content, setContent] = useState("");
    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`/posts/${postId}/comments`, { content });
    
        setContent("");
    };

    return (
        <div className="">
            <form onSubmit={onSubmit}>
                <label>New Comment</label>
                <div className="form-group">
                    <input value={content} onChange={e => setContent(e.target.value)} className="form-control" />
                </div>
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}