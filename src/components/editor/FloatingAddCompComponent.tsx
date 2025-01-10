import { FaCog, FaPlus } from "react-icons/fa";
import IEditorComponent from "./classes/IEditorComponent";
import { FaTrash } from "react-icons/fa6";

export default function FloatingAddCompComponent({
  comp,
  position,
}: {
  comp: IEditorComponent;
  position: "top_right" | "top_left" | "bottom_right" | "bottom_left";
}) {
  const convertPosition = (position: string) => {
    switch (position) {
      case "top_right":
        return "top-0 right-0";
      case "top_left":
        return "top-0 left-0";
      case "bottom_right":
        return "bottom-0 right-0";
      case "bottom_left":
        return "bottom-0 left-0";
      default:
    }
  };

  return (
    <div
      className={`flex flex-row absolute ${convertPosition(position)} z-[9999]`}
    >
      <button
        className="bg-zinc-200 text-zinc-500 w-6 h-6 flex items-center justify-center hover:bg-zinc-300 focus:outline-none rounded-tl-md rounded-bl-md"
        aria-label="Add Component"
        onClick={() => comp.getModalMethod()(comp)}
      >
        <FaPlus />
      </button>
      <button
        className="bg-zinc-200 text-zinc-500 w-6 h-6 flex items-center justify-center hover:bg-zinc-300 focus:outline-none"
        aria-label="Delete Component"
        onClick={() => {}}
      >
        <FaTrash />
      </button>
      <button
        className="bg-zinc-200 text-zinc-500 w-6 h-6 flex items-center justify-center hover:bg-zinc-300 focus:outline-none rounded-tr-md rounded-br-md"
        aria-label="Add Component"
        onClick={() => comp.getSelectedComponentMethod()(comp)}
      >
        <FaCog />
      </button>
    </div>
  );
}
