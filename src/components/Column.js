import React from "react";
import { useDrop } from "react-dnd";

const ItemTypes = {
  CARD: "card",
};

export default function Column({ cards, onDropCard }) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => onDropCard(item.card),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      className={`w-24 min-h-[200px] p-2 rounded-lg border-2 ${
        isOver ? "bg-blue-100 dark:bg-blue-800" : "bg-gray-100 dark:bg-gray-700"
      } flex flex-col items-center justify-start gap-2`}
    >
      {cards.map((card, index) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  );
}
