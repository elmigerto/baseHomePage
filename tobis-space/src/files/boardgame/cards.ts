const cardModules = import.meta.glob(
	"./images/cards/*.{png,jpg,jpeg,JPG,JPEG}",
	{
		eager: true,
		import: "default",
	},
);

export interface GameCard {
	id: string;
	name: string;
	image: string;
}

const cards: GameCard[] = Object.entries(cardModules)
	.map(([path, mod]) => {
		const file = path.split("/").pop() ?? "";
		const name = file
			.replace(/\.[^./]+$/, "")
			.replace(/[_-]/g, " ")
			.trim();
		return {
			id: path,
			name,
			image: mod as string,
		};
	})
	.sort((a, b) => a.name.localeCompare(b.name));

export default cards;
