import Card from "@/components/cards/Card";
import CustomPagination from "@/components/navigation/pagination/pagination";
import Hero from "@/layout/hero";
import Layout from "@/layout/Layout";
import { createClient } from "contentful";

export default function Home({ posts}) {
  console.log(posts);
  return (
    <Layout>
      <div className="hero-bg">
        <Hero />
      </div>
      {/* ajout de l'id sur la div pour que l'icon arrowdown envoie une "direction"  vers la premier section du site */}
      <div
        className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 md:py-24 md:gap-10 "
        id="sectionCard"
      >
        {posts.map((post) => (
          // Ternaire de si mon post slug est strictement égale à Mode("Mode" et le slug rentré sur contentful sur la 9e card qui donc l'id 8) alors en format tablet je le cache sinon en lg il sera block.
          <div
            key={post.sys.id}
            className={post.fields.slug === "Mode" ? "md:hidden lg:block" : ""}
          >
            <Card
              key={post.sys.id}
              title={post.fields.title}
              slug={post.fields.slug}
              extract={post.fields.extract}
              img={post.fields.featureImage.fields.file.url}
              createdAT={post.fields.createdAt}
            />
          </div>
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
