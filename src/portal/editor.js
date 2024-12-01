// src/app/blogs/editor.js
import BlogEditor from "@/modules/blogs/BlogEditor";
import { Card, CardContent, CardHeader, CardTitle } from "shadcn-ui";

export default function BlogEditorPage() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-4">
            Blog Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BlogEditor />
        </CardContent>
      </Card>
    </div>
  );
}
