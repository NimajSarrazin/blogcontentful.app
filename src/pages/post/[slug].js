import Layout from "@/layout/Layout";
import React from "react";
import { createClient } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import HeroAll from "@/layout/heroAll";

// Connect to contentful
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENT_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENT_ACESS_TOKEN,
});

export async function getStaticPaths() {
  // Get blogNextjs content type entries from Contentful
  const res = await client.getEntries({
    content_type: "blogNextjs",
  });

  // Map over the entries and return an array of params objects
  const slugs = res.items.map((slug) => {
    return {
      params: { slug: slug.fields.slug },
    };
  });

  // Return the paths object
  return {
    paths: slugs,
    fallback: false,
  };
}

// récuperer la data du post
export async function getStaticProps({ params }) {
  // je récupere la data
  const res = await client.getEntries({
    content_type: "blogNextjs",
    "fields.slug": params.slug,
  });

  // je stock la data du post dans une varaible

  const post = res.items;

  return {
    props: {
      post: post[0],
    },
  };
}

export default function Index({ post }) {
  const { title, featureImage, content} = post.fields;
  return (
    <Layout>
      <HeroAll title='Blog Single'/>
      <div>
        <img src={featureImage.fields.file.url} alt={title} className="max-w-xs" />
        <p>{title}</p>
        <div>{documentToReactComponents(content)}</div>
      </div>
    </Layout>
  );
}
