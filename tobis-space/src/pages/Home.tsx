import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RandomImageStack from "../components/RandomImageStack";
import { useTranslation } from "../contexts/LanguageContext";

const backgrounds = Object.values(
	import.meta.glob("../files/landing-page/image/*.{png,jpg,jpeg}", {
		eager: true,
		import: "default",
	}),
) as string[];

export default function Home() {
        const t = useTranslation();
        const [index, setIndex] = useState(() =>
                Math.floor(Math.random() * backgrounds.length),
        );
	const [fade, setFade] = useState(false);

	useEffect(() => {
		let fadeTimer: number;

		function cycle() {
			setFade(true);
			fadeTimer = window.setTimeout(() => {
				setIndex((i) => (i + 1) % backgrounds.length);
				setFade(false);
				cycle();
			}, 100_000);
		}

		cycle();
		return () => {
			clearTimeout(fadeTimer);
		};
	}, []);

	const next = (index + 1) % backgrounds.length;
	return (
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white text-center">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax]">
                                <img
                                        src={backgrounds[index]}
                                        alt="background"
                                        className={`w-full h-full object-cover transition-opacity duration-[100000ms] ${fade ? "opacity-0" : "opacity-100"} animate-spin-zoom`}
                                />
                        </div>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax]">
                                <img
                                        src={backgrounds[next]}
                                        alt="background"
                                        className={`w-full h-full object-cover transition-opacity duration-[100000ms] ${fade ? "opacity-100" : "opacity-0"} animate-spin-zoom`}
                                />
                        </div>
                        <div className="absolute inset-y-0 left-0 flex flex-col justify-center items-start gap-4 px-4 z-10">
                                <Link
                                        to="/boardgame"
                                        className="px-4 py-2 rounded border border-gray-300 bg-gray-200/60 text-gray-900 backdrop-blur-md shadow hover:bg-gray-200/80 dark:border-gray-600 dark:bg-gray-700/60 dark:text-gray-100 dark:hover:bg-gray-700/80"
                                >
                                        {t('nav.boardgame')}
                                </Link>
                                <Link
                                        to="/stories"
                                        className="px-4 py-2 rounded border border-gray-300 bg-gray-200/60 text-gray-900 backdrop-blur-md shadow hover:bg-gray-200/80 dark:border-gray-600 dark:bg-gray-700/60 dark:text-gray-100 dark:hover:bg-gray-700/80"
                                >
                                        {t('nav.stories')}
                                </Link>
                                <Link
                                        to="/drawings"
                                        className="px-4 py-2 rounded border border-gray-300 bg-gray-200/60 text-gray-900 backdrop-blur-md shadow hover:bg-gray-200/80 dark:border-gray-600 dark:bg-gray-700/60 dark:text-gray-100 dark:hover:bg-gray-700/80"
                                >
                                        {t('nav.drawings')}
                                </Link>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex flex-col justify-center items-end gap-4 px-4 z-10">
                                <Link
                                        to="/software"
                                        className="px-4 py-2 rounded border border-gray-300 bg-gray-200/60 text-gray-900 backdrop-blur-md shadow hover:bg-gray-200/80 dark:border-gray-600 dark:bg-gray-700/60 dark:text-gray-100 dark:hover:bg-gray-700/80"
                                >
                                        {t('nav.software')}
                                </Link>
                                <Link
                                        to="/about"
                                        className="px-4 py-2 rounded border border-gray-300 bg-gray-200/60 text-gray-900 backdrop-blur-md shadow hover:bg-gray-200/80 dark:border-gray-600 dark:bg-gray-700/60 dark:text-gray-100 dark:hover:bg-gray-700/80"
                                >
                                        {t('nav.about')}
                                </Link>
                        </div>
                        <RandomImageStack />
                </section>
	);
}
