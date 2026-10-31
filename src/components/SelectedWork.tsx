const projects = [
  {
    name: 'OBJECT',
    category: 'Furniture & lighting',
    description: 'A warm, tactile shopping experience. A moving gallery, a filterable collection and thoughtful product details.',
    href: '/projects/object/index.html',
    images: ['/projects/object/assets/chair.webp', '/projects/object/assets/dining.webp', '/projects/object/assets/lamp.webp'],
    tags: ['Web design', 'Development', 'Motion'],
  },
];

export function SelectedWork() {
  return <section id="projects" className="selected-work-section section-pad">
    <div className="section-kicker"><span>01 / SELECTED WORK</span><span>IDEAS, MADE REAL</span></div>
    <div className="section-intro"><h2>Built to be<br/><span className="muted">experienced.</span></h2><p>A few things I’ve designed<br/>and brought to life on the web.</p></div>
    <div className="selected-work-grid">
      {projects.map((project, index) => <a className="selected-work-card" href={project.href} key={project.href} aria-label={`View ${project.name} website`}>
        <div className="selected-work-preview">
          <div className="work-preview-top"><span>{project.name}</span><span>FURNITURE, LIGHT & EVERYDAY OBJECTS</span></div>
          <div className="work-preview-gallery" aria-hidden="true">{project.images.map((image) => <img key={image} src={image} alt="" loading="lazy" decoding="async" width="941" height="1672"/>)}</div>
          <span className="work-preview-open">View live website</span>
          <span className="work-preview-caption">Objects to live with.</span>
        </div>
        <div className="selected-work-details">
          <div><span className="work-project-index">{String(index + 1).padStart(2, '0')} / {project.category}</span><h3>{project.name}</h3><p>{project.description}</p></div>
          <div className="selected-work-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </a>)}
    </div>
  </section>;
}
