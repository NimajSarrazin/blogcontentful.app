import Card from "@/components/Card";
import Layout from "@/layout/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="">
        <h1 className="text-red-400 uppercase">Home page</h1>
        <Card title="toto" />
      </div>
    </Layout>
  );
}
