import { Heart, MessageCircle, Eye } from "lucide-react";
import { topPosts } from "@/lib/mockData";

export function TopPosts() {
  return (
    <div className="stat-card fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Posts</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topPosts.map((post, index) => (
          <div key={post.id} className="group relative overflow-hidden rounded-xl">
            <img
              src={post.image}
              alt={`Top post ${index + 1}`}
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3 text-primary-foreground">
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {post.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {post.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {(post.reach / 1000).toFixed(1)}K
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-2 left-2 gradient-instagram text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
              #{index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
