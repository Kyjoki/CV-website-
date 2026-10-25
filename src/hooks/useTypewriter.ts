import { useEffect, useState } from 'react';
export function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [length, setLength] = useState(0);
  useEffect(() => {
    setLength(0);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setLength(text.length); return; }
    let interval: ReturnType<typeof setInterval> | undefined;
    const timer = window.setTimeout(() => {
      let count = 0;
      interval = setInterval(() => { count += 1; setLength(count); if (count >= text.length) clearInterval(interval); }, speed);
    }, startDelay);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [text, speed, startDelay]);
  return { displayed: text.slice(0, length), done: length >= text.length };
}
