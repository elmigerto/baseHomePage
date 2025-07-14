import { useState } from "react";
import tokens from "../files/boardgame/tokens";
import { useTranslation } from "../contexts/LanguageContext";

export default function BoardGameGameTokens() {
  const t = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <h4 className="subpage-title">{t("boardgame.tokens")}</h4>
      <div className="flex flex-wrap justify-center gap-4">
        {tokens.map((tok) => (
          <img
            key={tok.id}
            src={tok.image}
            alt={tok.name}
            loading="lazy"
            className="h-24 w-24 cursor-pointer object-contain"
            onClick={() => setSelected(tok.image)}
          />
        ))}
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <img src={selected} alt="token" className="max-h-full max-w-full" />
        </div>
      )}
    </div>
  );
}
