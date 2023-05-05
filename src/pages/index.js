
import Card from "@/components/cards/Card";
import Navbar from "@/components/navigation/Navbar";
import CustomPagination from "@/components/navigation/pagination/pagination";
import Pagination from "@/components/navigation/pagination/pagination";
import Hero from "@/layout/hero";
import Layout from "@/layout/Layout";
import { createClient } from "contentful";

export default function Home({ posts }) {
  console.log(posts)
  return (
    <Layout>
      <div className="hero-bg">
        <Hero />
      </div>
      <div className="container grid grid-cols-1 md:grid-cols-2 md:gap-10 md:py-24 lg:grid-cols-3">
        {posts.map((post) => (
          <Card
            key={post.sys.id}
            title={post.fields.title}
            slug={post.fields.slug}
            extract={post.fields.extract}
            img={post.fields.featureImage.fields.file.url}
          />
        ))}
      </div>
      <div className="">
        <CustomPagination />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  // Je récupére ma data en de sucess
  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENT_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENT_ACESS_TOKEN,
  });
  const data = await client.getEntries({
    content_type: "blogNextjs",
    order: "sys.createdAt",
    limit: 9,
  });
  // On envoie la data dans le props de la page

  return {
    props: {
      posts: data.items,
    },
  };
}
