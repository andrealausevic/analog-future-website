type WordmarkProps = {
  href?: string;
  className?: string;
};

export function Wordmark({ href = "/", className = "" }: WordmarkProps) {
  return (
    <a
      className={`af-wordmark ${className}`.trim()}
      href={href}
      aria-label="Analog Future, home"
    >
      <span className="af-wordmark__analog">Analog</span>
      <span className="af-wordmark__future">Future</span>
    </a>
  );
}
