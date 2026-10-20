type CaseStudyFooterProps = {
  eyebrow?: string;
  statement: string;
  nextTitle: string;
  nextHref: string;
};

export function CaseStudyFooter({
  eyebrow = "The solution",
  statement,
  nextTitle,
  nextHref,
}: CaseStudyFooterProps) {
  return (
    <footer className="project-footer">
      <p className="project-kicker">{eyebrow}</p>
      <p className="project-footer__statement">{statement}</p>
      <a className="project-footer__next" href={nextHref}>
        <span className="project-kicker">Next</span>
        <span>{nextTitle}</span>
        <span aria-hidden="true">↗</span>
      </a>
    </footer>
  );
}
