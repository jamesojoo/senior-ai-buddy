import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes"; // ✅ Now imported from ItemTypes

export default function Card({ card, className = "", draggable = false }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { card },
    canDrag: draggable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  if (!card) return null;

  return (
    <div
      ref={dragRef}
      className={`w-20 h-28 flex items-center justify-center rounded-md text-xl font-bold border-2 transition-transform ${
        isDragging ? "opacity-40 scale-90" : "opacity-100 scale-100"
      } bg-white dark:bg-gray-800 shadow ${className}`}
    >
      {card.rank}{card.suit}
    </div>
  );
}
