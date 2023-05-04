import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navigation/Navbar";
import Hero from "./hero";

export default function Layout({ children }) {
  return (
    <div className="">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
