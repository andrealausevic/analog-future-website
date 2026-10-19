type ProjectCardProps = {
  index: string;
  title: string;
  category: string;
  tags: string;
  href: string;
  image: string;
  imageAlt: string;
};

export function ProjectCard({
  index,
  title,
  category,
  tags,
  href,
  image,
  imageAlt,
}: ProjectCardProps) {
  return (
    <article className="af-project-card">
      <a className="af-project-card__link" href={href}>
        <div className="af-project-card__artwork">
          <img
            src={image}
            alt={imageAlt}
            width="426"
            height="420"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="af-project-card__content">
          <p className="af-micro">{index}</p>
          <p className="af-micro">{category}</p>
          <h3>{title}</h3>
          <p className="af-project-card__tags">{tags}</p>
        </div>
      </a>
    </article>
  );
}
