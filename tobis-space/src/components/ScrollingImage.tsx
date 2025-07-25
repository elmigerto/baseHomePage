import { useEffect, useState } from "react";

export default function ScrollingImage({ images }: { images: string[] }) {
  const [src, setSrc] = useState(() => {
    if (images.length === 0) return "";
    return images[Math.floor(Math.random() * images.length)];
  });
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(window.scrollY * 0.1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSrc(images[Math.floor(Math.random() * images.length)]);
  }, [images]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt="random"
      className="fixed bottom-4 left-4 w-32 h-32 object-contain pointer-events-none transition-transform"
      style={{ transform: `translateX(${offset}px)` }}
    />
  );
}
