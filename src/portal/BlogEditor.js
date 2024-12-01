// src/modules/blogs/BlogEditor.js
import React, { useState } from "react";
import { createBlog } from "../../utils/blog";
import { Input, Button, Textarea } from "shadcn-ui";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await createBlog(
      { title, content, category, tags: tags.split(",") },
      setLoading
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create a New Blog</h1>
      <Input
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />
      <ReactQuill value={content} onChange={setContent} className="mb-4" />
      <Input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mb-4"
      />
      <Textarea
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleSubmit} className="bg-blue-500" disabled={loading}>
        {loading ? "Creating..." : "Create Blog"}
      </Button>
    </div>
  );
};

export default BlogEditor;
