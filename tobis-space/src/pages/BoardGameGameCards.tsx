import { useState } from "react";
import cards from "../files/boardgame/cards";
import { useTranslation } from "../contexts/LanguageContext";

export default function BoardGameGameCards() {
	const t = useTranslation();
	const [selected, setSelected] = useState<string | null>(null);
	return (
		<div className="space-y-4">
			<h4 className="subpage-title">{t("boardgame.cards")}</h4>
			<div className="flex flex-wrap justify-center gap-4">
				{cards.map((c) => (
					<img
						key={c.id}
						src={c.image}
						alt={c.name}
						loading="lazy"
						className="h-40 w-28 cursor-pointer object-contain"
						onClick={() => setSelected(c.image)}
					/>
				))}
			</div>
			{selected && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
					onClick={() => setSelected(null)}
				>
					<img src={selected} alt="card" className="max-h-full max-w-full" />
				</div>
			)}
		</div>
	);
}
