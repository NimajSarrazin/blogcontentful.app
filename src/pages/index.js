
import Card from "@/components/cards/Card";
import Hero from "@/layout/hero";
import Layout from "@/layout/Layout";
import { createClient } from "contentful";

export default function Home({ posts }) {
  console.log(posts)
  return (
    <Layout>
      <div className="">
        <Hero
          bgColor="bg-gradient-to-r from-[#f762E4] via-[#F38488] to-[#FAAD85]"
          title="Readit blog"
          url_img=""
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {posts.map((post) =>(
          <Card 
          key={post.sys.id}
          title={post.title}
          slug={post.fields.slug}
          extract={post.fields.extract}
          img={post.fields.featureImage.fields.file.url}
          />
        ))}
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
    limit: 8,
  });
  // On envoie la data dans le props de la page

  return {
    props: {
      posts: data.items,
    },
  };
}
