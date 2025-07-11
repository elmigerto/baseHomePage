const tokenModules = import.meta.glob(
  "./images/tokken/*.{png,jpg,jpeg,JPG,JPEG}",
  {
    eager: true,
    import: "default",
  },
);

export interface GameToken {
  id: string;
  name: string;
  image: string;
}

const tokens: GameToken[] = Object.entries(tokenModules)
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

export default tokens;
