import BlogForm from "../BlogForm";
import { createBlog } from "../actions";

export const metadata = { title: "New blog post" };

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-navy">New blog post</h1>
      <p className="mt-1 text-sm text-gray-500">
        Add a new article to the Travel Guide.
      </p>
      <div className="mt-6">
        <BlogForm action={createBlog} submitLabel="Create post" />
      </div>
    </div>
  );
}
