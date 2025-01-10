import { useEffect } from "react";
import IEditorComponent from "./classes/IEditorComponent";
import RootComponent from "./components/RootComponent";

export default function EditorModalComponent({
  rootComponent,
  component,
  setModal,
}: {
  rootComponent?: RootComponent;
  component: IEditorComponent;
  setModal: (comp: IEditorComponent | null) => void;
}) {
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModal(null);
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[50] transition-opacity duration-300">
      <div className="bg-white w-4/5 md:w-1/3 rounded-lg shadow-lg transform transition-all scale-95 flex flex-col">
        {/* Header */}
        <div className="w-full h-full flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 uppercase">
            Přidat komponentu - {component.name}
          </h2>
          <button
            onClick={() => setModal(null)}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
            aria-label="Close Modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4 max-h-[50vh] overflow-y-auto">
          {rootComponent &&
            rootComponent.availableComponents.map((category, i) => (
              <div key={i} className="w-full h-full">
                <h4 className="text-lg font-semibold w-full uppercase tracking-widest">
                  {category.category}
                </h4>
                <div className="flex flex-row items-center justify-center flex-wrap gap-4">
                  {category.components.map((comp, j) => (
                    <button
                      key={i}
                      onClick={() => {
                        const compp = comp.clone();
                        compp.setRootComponent(rootComponent);
                        component.addSubComponent(compp);
                        setModal(null);
                      }}
                      className="w-28 h-28 flex flex-col items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      {comp.icon && (
                        <comp.icon className="text-xl text-blue-500" />
                      )}
                      <span className="text-gray-700 font-semibold mt-2 uppercase text-sm">
                        {comp.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
