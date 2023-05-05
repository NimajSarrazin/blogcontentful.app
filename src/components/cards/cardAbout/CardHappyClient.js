import { Avatar } from "@nextui-org/react";
export default function CardHappyClient() {
  const data = [
    {
      title: "Roger Scott",
      job: "Marketing Manager",
      url_img: "/img/Personne1.webp",
    },
    { title: "Jane Smith", job: "Sales Manager", url_img: "/img/person_2.jpg" },
    {
      title: "Bob Johnson",
      job: "Product Manager",
      url_img: "/img/person_3.jpg",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:justify-center md:gap-2  md:grid-cols-3 pt-20">
      {data.map((item, index) => (
        <div
          key={index}
          className={`max-w-md mx-4 my-4 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl ${
            index === 0 ? "" : "hidden md:block"
          }`}
        >
          <p className="px-6 py-4">
            Far far away, behind the word mountains, far from the countries
            Vokalia and Consonantia, there live the blind texts.
          </p>
          <div className="flex items-center px-6 py-4">
            <Avatar
              size="large"
              src={item.url_img}
              alt="personne1.webp"
              className="rounded-full w-16 md:w-20"
            />
            <div className="ml-4">
              <h2 className="font-bold text-xl md:text-2xl">{item.title}</h2>
              <p className="text-yellow-400 text-base md:text-lg">{item.job}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
