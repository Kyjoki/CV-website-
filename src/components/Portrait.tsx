import { useEffect, useRef } from 'react';
const FRAME_COUNT = 105;
const CENTER_FRAME = 53;
const FOLLOW_TIME = 0.24;
const MAX_SPEED = 0.68;
const frameUrl = (index: number) => `/media/turn-kling/${String(index).padStart(3, '0')}.webp`;
export function Portrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    const fallback = imageRef.current;
    if (!canvas || !fallback) return;
    const images = new Map<number, HTMLImageElement>();
    let active = true;
    let disposed = false;
    let animation = 0;
    let previousTime = 0;
    let target = 0.5;
    let position = 0.5;
    let painted = -1;
    let lastPaint = ''; 
    const paint = () => {
      if (disposed) return;
      const frame = 1 + position * (FRAME_COUNT - 1);
      const low = Math.floor(frame);
      const high = Math.min(FRAME_COUNT, low + 1);
      const blend = frame - low;
      const a = images.get(low);
      const b = images.get(high);
      if (!a?.complete || !a.naturalWidth) return;
      const signature = `${frame.toFixed(4)}:${Boolean(b?.complete && b.naturalWidth)}`;
      if (signature === lastPaint) return;
      lastPaint = signature;
      if (context) {
        context.globalAlpha = 1;
        context.drawImage(a, 0, 0, canvas.width, canvas.height);
        if (blend > 0.001 && b?.complete && b.naturalWidth) {
          context.globalAlpha = blend;
          context.drawImage(b, 0, 0, canvas.width, canvas.height);
          context.globalAlpha = 1;
        }
        canvas.style.opacity = '1';
      } else if (painted !== low) fallback.src = a.src;
      painted = low;
      sceneRef.current?.setAttribute('data-gaze-frame', frame.toFixed(2));
    };
    const load = (index: number) => {
      if (index < 1 || index > FRAME_COUNT || images.has(index)) return;
      const img = new Image(); img.decoding = 'async';
      images.set(index, img);
      img.onload = paint;
      img.src = frameUrl(index);
    };
    const warm = () => {
      const frame = 1 + Math.round(position * (FRAME_COUNT - 1));
      const direction = target >= position ? 1 : -1;
      load(frame); load(frame + 1);
      // Warm the movement path; preserve a small decoded window around the current pose.
      for (let step = 1; step <= 6; step++) load(frame + step * direction);
      for (let step = 1; step <= 3; step++) load(frame - step * direction);
      if (images.size > 18) {
        const farthest = [...images.keys()].sort((a, b) => Math.abs(b - frame) - Math.abs(a - frame));
        for (const index of farthest.slice(0, images.size - 18)) {
          const image = images.get(index); if (image) image.onload = null;
          images.delete(index);
        }
      }
    };
    const render = (time: number) => {
      animation = 0;
      if (disposed || !active) { previousTime = 0; return; }
      const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.1) : 1 / 60;
      previousTime = time;
      const distance = target - position;
      const easedStep = distance * (1 - Math.exp(-dt / FOLLOW_TIME));
      const maxStep = MAX_SPEED * dt;
      position = Math.abs(distance) < 0.0001 ? target : position + Math.max(-maxStep, Math.min(maxStep, easedStep));
      warm(); paint();
      if (Math.abs(target - position) >= 0.0001) animation = requestAnimationFrame(render);
      else previousTime = 0;
    };
    const aim = (fraction: number) => {
      target = Math.max(0, Math.min(1, fraction));
      if (!animation) animation = requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => { if (active) aim(event.clientX / Math.max(1, window.innerWidth)); };
    const center = () => aim(0.5);
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active && !animation) animation = requestAnimationFrame(render);
    });
    const hero = document.getElementById('home'); if (hero) observer.observe(hero);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', move, { passive: true });
    window.addEventListener('resize', center);
    warm();
    return () => {
      disposed = true; cancelAnimationFrame(animation); observer.disconnect();
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', move); window.removeEventListener('resize', center);
      images.forEach(img => { img.onload = null; }); images.clear();
    };
  }, []);
  return <>
    <div ref={sceneRef} className="portrait-scene" data-gaze-frame={CENTER_FRAME} aria-hidden="true"><img ref={imageRef} className="portrait-video" src={frameUrl(CENTER_FRAME)} alt="" width="960" height="540" fetchPriority="high"/><canvas ref={canvasRef} className="portrait-video" width="960" height="540" style={{ opacity: 0 }}/></div>
  </>;
}
