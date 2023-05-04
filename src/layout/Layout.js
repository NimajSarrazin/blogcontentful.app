import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navigation/Navbar'

export default function Layout({children}) {
  return (
    <div className="">
      <Navbar />
      <main>{children}</main>
      <Footer bgColor="bg-gradient-to-r from-[#f762E4] via-[#F38488] to-[#FAAD85] p-10" />
    </div>
  );
}
