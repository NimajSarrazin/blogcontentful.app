import { getSearchablePosts } from "@/services/contentful/blog.service";
import { AppProvider } from "@/providers/app-provider";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const posts = await getSearchablePosts();

  return <AppProvider posts={posts}>{children}</AppProvider>;
}
