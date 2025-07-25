import { useEffect, useRef, useState } from "react";

export default function ScrollingImage({ images }: { images: string[] }) {
  const [src, setSrc] = useState(() => {
    if (images.length === 0) return "";
    return images[Math.floor(Math.random() * images.length)];
  });
  const [offset, setOffset] = useState(0);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScroll.current;
      setOffset((o) => o + delta * 0.2);
      lastScroll.current = current;
    };
    lastScroll.current = window.scrollY;
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
      alt=""
      className="pointer-events-none fixed left-1/2 top-1/2 -z-10 h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 object-cover opacity-60 transition-transform"
      style={{ transform: `translateX(${offset}px)` }}
    />
  );
}
