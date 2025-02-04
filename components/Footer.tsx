import { FaReact } from "react-icons/fa";
import { RiNextjsLine } from "react-icons/ri";
import { TbBrandMongodb } from "react-icons/tb";

const listFramework = [
  {
    name: "next",
    icon: RiNextjsLine,
  },
  {
    name: "react",
    icon: FaReact,
  },
  { name: "mongodb", icon: TbBrandMongodb },
];

export default function Footer() {
  return (
    <footer className=" w-full flex flex-col justify-center items-center bg-blue-950 text-white gap-4 ">
      <h1 className="font-bold hover:text-yellow-600">Météo app</h1>
      <p className=" text-white"> with </p>
      <ul className="flex items-end justify-center mb-2 gap-2">
        {listFramework.map((items, index) => (
          <li
            key={index}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <items.icon />
            <span>{items.name}</span>
          </li>
        ))}
      </ul>
    </footer>
  );
}
