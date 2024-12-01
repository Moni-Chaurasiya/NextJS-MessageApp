// "use client";
// import React, { useEffect, useState } from "react";
// import { fetchAllBlogs } from "../../utils/blog";
// import BlogCard from "./BlogCard";
// import { Card, CardContent, CardHeader, CardTitle } from "shadcn-ui";

// const BlogList = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAllBlogs(setBlogs, setLoading);
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl font-bold italic text-center mb-8">Blog</h1>
//       {loading ? (
//         <p>Loading blogs...</p>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {blogs.map((blog) => (
//             <BlogCard key={blog.id} blog={blog} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogList;

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchAllBlogs } from "../../utils/blog";
const BlogCard = dynamic(() => import("./BlogCard"), { ssr: false });

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBlogs(setBlogs, setLoading);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold italic text-center mb-8">Blog</h1>
      {loading ? (
        <p>Loading blogs...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
