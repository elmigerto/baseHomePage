const hexModules = import.meta.glob(
  "./images/hexagon/*.{png,jpg,jpeg,JPG,JPEG}",
  {
    eager: true,
    import: "default",
  },
);

export interface GameHex {
  id: string;
  name: string;
  image: string;
}

const hexagons: GameHex[] = Object.entries(hexModules)
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

export default hexagons;
