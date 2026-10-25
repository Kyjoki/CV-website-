import { useEffect, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Portrait } from './components/Portrait';
import { useTypewriter } from './hooks/useTypewriter';
const EMAIL = '242391@astanait.edu.kz';
const LINKEDIN = 'https://www.linkedin.com/in/maksim-tsoy-350238334/';
const CV_URL = '/maksim-tsoy-cv.pdf?v=f0b5e2fac51a';
function DownloadCV() {
  const [href, setHref] = useState(CV_URL);
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | undefined;
    const prepare = async () => {
      try {
        const response = await fetch(CV_URL, { credentials: 'same-origin', signal: controller.signal });
        if (!response.ok) return;
        const bytes = await response.arrayBuffer();
        if (controller.signal.aborted || new TextDecoder().decode(bytes.slice(0, 5)) !== '%PDF-') return;
        objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
        setHref(objectUrl);
      } catch {
        // Keep the original PDF link available if preloading fails.
      }
    };
    void prepare();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);
  return <a href={href} download="Maksim_Tsoy_CV.pdf">Download CV</a>;
}

function CopyEmail({ dark = false }: { dark?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(EMAIL);
      else {
        const field = document.createElement('textarea'); field.value = EMAIL; field.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.appendChild(field); field.select();
        const copied = document.execCommand('copy'); field.remove(); if (!copied) throw new Error('Copy unavailable');
      }
      setStatus('copied');
    }
    catch { setStatus('failed'); }
    clearTimeout(timer.current); timer.current = setTimeout(() => setStatus('idle'), 2500);
  };
  return <div className="copy-wrap"><button className={`pill pill-outline ${dark ? 'outline-dark' : ''}`} type="button" onClick={copy} aria-label={`Copy email ${EMAIL}`}><span>{status === 'copied' ? 'Copied. Say hello anytime.' : status === 'failed' ? 'Copy unavailable. Use the contact link.' : <>Reach me: <span className="underline underline-offset-2">{EMAIL}</span></>}</span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">{status === 'copied' ? <path d="m2 6 2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.2"/> : <><rect x="4" y="4" width="6.5" height="6.5" rx=".8" stroke="currentColor"/><path d="M7.5 2H2a.5.5 0 0 0-.5.5V8" stroke="currentColor"/></>}</svg></button><span className="sr-only" role="status">{status === 'copied' ? 'Email copied to clipboard' : status === 'failed' ? 'Copy unavailable. Use the email link in Contact.' : ''}</span></div>;
}
function Hero() {
  const { displayed, done } = useTypewriter('I connect the dots between security, AI and real-world problems. What are we building next?');
  return <section id="home" className="hero">
    <Portrait/><div className="hero-shade"/>
    <div className="hero-topline"><span><i className="status-dot"/> OPEN TO OPPORTUNITIES</span></div>
    <div className="hero-content">
      <div className="intro-blur" aria-hidden="true">A curious mind. A hands-on builder.<br/>A little obsessed with how things work.</div>
      <p className="hero-greeting">Hey, I’m Maksim.</p>
      <p className="typewriter" aria-label="I connect the dots between security, AI and real-world problems. What are we building next?"><span aria-hidden="true">{displayed}{!done && <span className="typing-cursor"/>}</span></p>
    </div>
    <div className="hero-bottom"><h1>Maksim Tsoy</h1><div className="hero-bottom-line"><span>CYBERSECURITY STUDENT / AI BUILDER</span><a href="#about">A LITTLE MORE ABOUT ME </a></div></div>
  </section>;
}
const experience = [
  { company: 'Ailillu', role: 'Client onboarding & creative support', date: '2026 / CURRENT', text: 'Helping restaurants get started with automation: onboarding, client communication, launch coordination and progress reporting. Creating photo, video and QR menu materials along the way.', skills: 'Onboarding · Communication · Creative production' },
  { company: 'Cyberfox', role: 'Cybersecurity intern', date: '2026', text: 'Continuing to develop practical cybersecurity skills alongside university studies and hands-on projects.', skills: 'Cybersecurity · Continuous learning' },
  { company: 'Engineering & Technical Center', role: 'Cybersecurity intern', date: 'JUN — JUL 2026', text: 'Monitored security events in IBM QRadar and Elastic Stack, participated in internal security audits, deployed GoPhish awareness simulations and documented findings and remediation steps.', skills: 'IBM QRadar · Elastic Stack · GoPhish', note: 'Department of Presidential Affairs of the Republic of Kazakhstan' },
];
function Experience() { return <section id="experience" className="experience-section section-pad"><div className="section-kicker"><span>01 / EXPERIENCE</span><span>LEARNING BY DOING</span></div><div className="section-intro"><h2>In the field.<br/><span className="muted">Not just in theory.</span></h2><p>From investigating security events<br/>to helping real businesses get started.</p></div><div className="experience-list">{experience.map((e, i) => <article className="experience-row" key={e.company}><span className="experience-index">0{i + 1}</span><div className="experience-company"><h3>{e.company}</h3><p>{e.role}</p>{e.note && <span className="company-note">{e.note}</span>}</div><div className="experience-description"><p>{e.text}</p><span>{e.skills}</span></div><span className="experience-date">{e.date}</span></article>)}</div><div id="achievements" className="hackathon-highlights"><div className="highlights-heading"><span className="eyebrow">HACKATHONS & HIGHLIGHTS</span><h3>Built under pressure.</h3></div><div className="highlights-grid"><article className="highlight-card"><div className="highlight-meta"><span>CATEGORY WINNER</span><span>2026</span></div><h4>Qostanai AI<br/>Industry Hackathon</h4><p>Won our category with my team at the hackathon hosted by Qostanai Hub.</p><a href={LINKEDIN} target="_blank" rel="noreferrer">On LinkedIn</a></article><article className="highlight-card"><div className="highlight-meta"><span>PARTICIPANT</span><span>2026</span></div><h4>HackAlem AI</h4><div className="highlight-score"><strong>82</strong><span>POINTS</span></div><p>Participated in the event that set a Guinness World Records title for the most participants in an agentic AI hackathon.</p><a href="https://www.guinnessworldrecords.com/world-records/778051-most-participants-in-an-agentic-ai-hackathon" target="_blank" rel="noreferrer">Official record</a></article></div></div></section>; }
function About() { return <section id="about" className="about-section section-pad"><div className="section-kicker"><span>02 / ABOUT ME</span><span>ALWAYS CURIOUS</span></div><div className="about-grid"><div className="about-photo"><img src="/media/portrait-right.webp" alt="A wool-textured portrait of Maksim wearing glasses and a black polo, looking to the right" loading="lazy" width="788" height="1400"/><span>HI AGAIN. STILL ME.</span></div><div className="about-copy"><h2>A security mindset.<br/>A builder’s instinct.</h2><p className="about-lead">I’m a third-year Cybersecurity student at Astana IT University, exploring the space where security, AI and useful products meet.</p><p>I like understanding how systems work, finding the weak spots and turning ideas into something people can actually use. Some days that means digging into a security alert. Other days it’s building a tool, preparing a hackathon pitch or helping a restaurant go live.</p><div className="about-facts"><div><span className="eyebrow">EDUCATION</span><strong>Astana IT University</strong><span>BSc studies in Cybersecurity · 2024–2027</span></div><div><span className="eyebrow">LANGUAGES</span><strong>Russian & English</strong><span>Native Russian · English B2</span></div></div><a href="/maksim-tsoy-cv.pdf?v=f0b5e2fac51a" target="_blank" rel="noreferrer" className="text-link">The one-page version</a></div></div><div className="toolkit"><span className="eyebrow">THINGS I WORK WITH</span><div>{['Elastic Stack', 'IBM QRadar', 'Python', 'Linux', 'Windows', 'TCP/IP', 'Network security', 'GoPhish', 'XAI', 'Client onboarding'].map(s => <span key={s}>{s}</span>)}</div></div><div className="certifications"><div><span className="eyebrow">THE LEARNING DOESN’T STOP</span><h3>A few credentials.</h3></div><a href="https://tryhackme.com/p/Kyjoki" target="_blank" rel="noreferrer"><span>01</span><div><strong>SOC Level 1</strong><small>TryHackMe / Jan 2026</small></div></a><a href="https://tryhackme.com/p/Kyjoki" target="_blank" rel="noreferrer"><span>02</span><div><strong>Pre Security</strong><small>TryHackMe / Oct 2025</small></div></a><a href="https://www.credly.com/users/tsoy-maksim" target="_blank" rel="noreferrer"><span>03</span><div><strong>IT Specialist: Cybersecurity</strong><small>Pearson / Feb 2026</small></div></a></div></section>; }
function Contact() { return <footer id="contact" className="contact-section section-pad"><div className="section-kicker"><span>03 / WHAT’S NEXT?</span><span><i className="status-dot"/> LET’S FIND OUT.</span></div><div className="contact-main"><span className="eyebrow">AN IDEA, AN OPPORTUNITY, OR JUST A HELLO.</span><a href={`mailto:${EMAIL}`} className="contact-heading">Let’s build<br/>something</a><div className="contact-links"><CopyEmail/><a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/Kyjoki" target="_blank" rel="noreferrer">GitHub</a><DownloadCV/></div></div><div className="footer-bottom"><a href="#home" className="footer-logo">Maksim <span>✳︎</span></a><span>© {new Date().getFullYear()} Maksim Tsoy</span><a href="#home">BACK TO TOP</a></div></footer>; }
export default function App() { return <><a className="skip-link" href="#experience">Skip to content</a><Navbar/><main><Hero/><Experience/><About/></main><Contact/></>; }
