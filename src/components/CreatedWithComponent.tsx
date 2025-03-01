import { useState } from "react";

export default function CreatedWithComponent() {
    const [hovered, setHovered] = useState(false);

    return (
        <div 
            className="fixed bottom-4 right-4 cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered ? (
                <div className="bg-neutral-200 border border-neutral-300 text-neutral-700 p-3 rounded-md transition-all duration-200 flex flex-col items-end">
                    <p className="text-xs">Vytvořeno pomocí</p>
                    <p className="font-semibold text-xs">Vytvorkonverzku</p>
                </div>
            ) : (
                <div className="bg-neutral-200 text-neutral-700 p-2 rounded-md hover:scale-105 transition-transform duration-200">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <path d="M12 3c-1.1 0-2 .9-2 2v2L7 5.7c-.9-.5-2-.2-2.5.7-.5.9-.2 2 .7 2.5L8 10.3V12H6c-1.1 0-2 .9-2 2s.9 2 2 2h2v1.7l-2.8 1.6c-.9.5-1.2 1.6-.7 2.5.5.9 1.6 1.2 2.5.7L10 20v2c0 1.1.9 2 2 2s2-.9 2-2v-2l2.8 1.6c.9.5 2 .2 2.5-.7.5-.9.2-2-.7-2.5L16 17.3V14h2c1.1 0 2-.9 2-2s-.9-2-2-2h-2v-1.7l2.8-1.6c.9-.5 1.2-1.6.7-2.5-.5-.9-1.6-1.2-2.5-.7L14 5v-2c0-1.1-.9-2-2-2z"/>
                </svg>
            </div>
            )}
        </div>
    );
}