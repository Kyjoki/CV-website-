import { useEffect, useRef, useState } from 'react';
const links = [['Experience', '#experience'], ['Highlights', '#achievements'], ['About', '#about']] as const;
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 80);
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onResize);
    onScroll(); return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const anchors = menu.current?.querySelectorAll<HTMLAnchorElement>('a');
    anchors?.[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (e.key === 'Tab') {
        const items = [toggle.current, ...Array.from(anchors ?? [])].filter(Boolean) as HTMLElement[];
        const index = items.indexOf(document.activeElement as HTMLElement);
        e.preventDefault(); items[(index + (e.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey); };
  }, [open]);
  return <>
    <header className={`navbar ${scrolled && !open ? 'navbar-scrolled' : ''}`}>
      <a href="#home" className="logo" aria-label="Maksim Tsoy home" onClick={() => setOpen(false)}>Maksim<span className="logo-star" aria-hidden="true">✳︎</span></a>
      <nav aria-label="Main navigation" className="hidden md:flex items-center text-[20px] lg:text-[23px]">{links.map(([label, href], i) => <span key={href}><a className="nav-link" href={href}>{label}</a>{i < links.length - 1 ? ',\u00a0' : ''}</span>)}</nav>
      <a className="hidden md:inline text-[20px] lg:text-[23px] underline underline-offset-4 nav-link" href="#contact">Let’s talk </a>
      <button ref={toggle} type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-menu" className={`hamburger md:hidden ${open ? 'is-open' : ''}`} onClick={() => setOpen(v => !v)}><span/><span/><span/></button>
    </header>
    <div ref={menu} id="mobile-menu" className={`mobile-menu md:hidden ${open ? 'is-open' : ''}`} inert={!open} aria-hidden={!open}>
      <span className="eyebrow opacity-40">A LITTLE LOOK AROUND</span>
      {links.map(([label, href], i) => <a key={href} href={href} onClick={() => setOpen(false)}><sup>0{i + 1}</sup>{label}</a>)}
      <a href="#contact" className="underline underline-offset-8" onClick={() => setOpen(false)}>Let’s talk</a>
      <span className="menu-foot">Maksim Tsoy</span>
    </div>
  </>;
}
