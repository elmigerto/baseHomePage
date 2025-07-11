import { useState } from "react";
import hexagons from "../files/boardgame/hexagons";
import { useTranslation } from "../contexts/LanguageContext";

export default function BoardGameGameHexagons() {
  const t = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <h4 className="subpage-title">{t("boardgame.hexagons")}</h4>
      <div className="flex flex-wrap justify-center gap-4">
        {hexagons.map((h) => (
          <img
            key={h.id}
            src={h.image}
            alt={h.name}
            loading="lazy"
            className="h-40 w-40 cursor-pointer object-contain"
            onClick={() => setSelected(h.image)}
          />
        ))}
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <img src={selected} alt="hexagon" className="max-h-full max-w-full" />
        </div>
      )}
    </div>
  );
}
