const imageModules = import.meta.glob('./**/*.{jpg,JPG,jpeg,JPEG,png}', {
  eager: true,
  import: 'default',
});

export interface Drawing {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

const drawings: Drawing[] = Object.entries(imageModules).map(([path, module]) => {
  const fullPath = path.slice(2); // remove leading './'
  const parts = fullPath.split('/');
  const file = parts.pop() as string;
  const category = parts.join('/');
  const name = file
    .replace(/\.[^./]+$/, '') // remove extension
    .replace(/[_-]/g, ' ')
    .trim();

  return {
    id: fullPath,
    name,
    category,
    price: 9.99,
    image: module as string,
  };
});

export const categories = Array.from(new Set(drawings.map((d) => d.category)));

export default drawings;
