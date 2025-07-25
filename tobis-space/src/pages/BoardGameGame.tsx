import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "../contexts/LanguageContext";

export default function BoardGameGame() {
	const t = useTranslation();
	return (
		<div className="space-y-4">
			<h3 className="subpage-title">{t("boardgame.game")}</h3>
                       <nav className="flex gap-4">
                               <Link to="cards" className="text-blue-500 underline">
                                       {t("boardgame.cards")}
                               </Link>
                               <Link to="hexagons" className="text-blue-500 underline">
                                       {t("boardgame.hexagons")}
                               </Link>
                               <Link to="tokens" className="text-blue-500 underline">
                                       {t("boardgame.tokens")}
                               </Link>
                       </nav>
			<Outlet />
		</div>
	);
}
