type ProjectCardProps = {
  index: string;
  title: string;
  category: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  artworkMotion?: "map" | "fog";
};

// Positions match the highlighted clusters and dots in the #WeCount thumbnail.
const mapPulses = [
  [113, 130, "#da920d"],
  [154, 104, "#da920d"],
  [185, 177, "#31932d"],
  [232, 226, "#31932d"],
  [89, 161, "#262826"],
  [273, 170, "#262826"],
  [330, 210, "#262826"],
  [145, 251, "#262826"],
  [273, 290, "#262826"],
] as const;

export function ProjectCard({
  index,
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
          <div className="af-project-card__picture">
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
                    style={{ animationDelay: `-${index * 390}ms` }}
                  >
                    <circle cx={x} cy={y} r="6" opacity=".26" />
                    <circle cx={x} cy={y} r="2.3" />
                  </g>
                ))}
              </svg>
            )}
            {artworkMotion === "fog" && <div className="af-project-card__fog" aria-hidden="true" />}
          </div>
        </div>
        <div className="af-project-card__content">
          <p className="af-micro">{index}</p>
          <p className="af-micro">{category}</p>
          <h3>{title}</h3>
          <p className="af-project-card__description">{description}</p>
        </div>
      </a>
    </article>
  );
}
