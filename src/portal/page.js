// import React from 'react'
// import heroImg from "@/assets/underconstruction.svg"
// import Image from 'next/image'

// const Blogs = () => {
//   return (
//     <div>
//       <Image
//       src={heroImg}
//       />
//     </div>
//   )
// }

// export default Blogs

// src/app/blogs/page.js
import React from "react";
import BlogList from "@/modules/blogs/BlogList";
import { Card, CardContent, CardHeader, CardTitle } from "shadcn-ui";

const Blogs = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center mb-8">
            Our Blogs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BlogList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Blogs;
