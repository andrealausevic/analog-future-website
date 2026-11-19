type ProjectCardProps = {
  title: string;
  category: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  artworkMotion?: "map" | "fog" | "sunset";
};

// These highlights appear in different areas of the #WeCount grid.
const mapPulses = [
  [82, 90, "#f7bd29"],
  [263, 147, "#63cb40"],
  [321, 205, "#f7bd29"],
  [103, 279, "#63cb40"],
  [338, 307, "#f7bd29"],
  [176, 354, "#63cb40"],
] as const;

export function ProjectCard({
  title,
  category,
  description,
  href,
  image,
  imageAlt,
  artworkMotion,
}: ProjectCardProps) {
  return (
    <article className="af-project-card">
      <a className="af-project-card__link" href={href}>
        <div className="af-project-card__artwork">
          <div className="af-project-card__picture" data-artwork-motion={artworkMotion}>
            <img
              src={image}
              alt={imageAlt}
              width="426"
              height="420"
              loading="lazy"
              decoding="async"
            />
            {artworkMotion === "map" && (
              <svg className="af-project-card__pulses" viewBox="0 0 426 420" aria-hidden="true" focusable="false">
                {mapPulses.map(([x, y, color], index) => (
                  <g
                    key={x + ":" + y}
                    className="af-project-card__pulse"
                    fill={color}
                    style={{ animationDelay: `-${index * 1400}ms` }}
                  >
                    <circle className="af-project-card__pulse-halo" cx={x} cy={y} r="18" opacity=".8" />
                    <circle cx={x} cy={y} r="5" />
                  </g>
                ))}
              </svg>
            )}
            {artworkMotion === "fog" && <div className="af-project-card__fog" aria-hidden="true" />}
            {artworkMotion === "sunset" && <div className="af-project-card__sunlight" aria-hidden="true" />}
          </div>
        </div>
        <div className="af-project-card__content">
          <p className="af-micro">{category}</p>
          <h3>{title}</h3>
          <p className="af-project-card__description">{description}</p>
        </div>
      </a>
    </article>
  );
}
