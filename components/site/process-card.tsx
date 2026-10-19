type ProcessCardProps = {
  index: string;
  title: string;
  description: string;
  services: string;
};

export function ProcessCard({
  index,
  title,
  description,
  services,
}: ProcessCardProps) {
  return (
    <article className="af-process-card">
      <p className="af-micro">{index}</p>
      <div className="af-process-card__copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <p className="af-process-card__services">{services}</p>
    </article>
  );
}
