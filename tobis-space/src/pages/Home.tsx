import { useEffect, useState } from "react";
import RandomImageStack from "../components/RandomImageStack";

const backgrounds = Object.values(
	import.meta.glob("../files/landing-page/image/*.{png,jpg,jpeg}", {
		eager: true,
		import: "default",
	}),
) as string[];

export default function Home() {
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
			<RandomImageStack />
		</section>
	);
}
