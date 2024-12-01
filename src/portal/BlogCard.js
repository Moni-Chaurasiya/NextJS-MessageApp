// src/modules/blogs/BlogCard.js
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "shadcn-ui";

const BlogCard = ({ blog }) => {
  return (
    <Card className="shadow-lg transition-transform transform hover:scale-105">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{blog.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mt-2">{blog.content.slice(0, 100)}...</p>
        <div className="mt-4 flex gap-2 flex-wrap">
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm bg-blue-200 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
