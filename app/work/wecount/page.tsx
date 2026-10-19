import type { Metadata } from "next";
import WeCountExplorer from "@/components/wecount/explorer";
import "./wecount.css";

export const metadata: Metadata = {
  title: "#WeCount — Analog Future",
  description: "An interactive reconstruction of Andrea Lausevic’s #WeCount data visualization, using published historical estimates from the Society of Family Planning.",
};

export default function WeCountPage() {
  return (
    <main className="wc-page">
      <header className="wc-site-header">
        <a className="wordmark" href="/" aria-label="Analog Future, home"><span>ANALOG</span><span>FUTURE</span></a>
        <a href="/#work">Back to work <span aria-hidden="true">↗</span></a>
      </header>
      <section className="wc-project-intro" aria-labelledby="wc-project-title">
        <div><p className="wc-kicker">Selected work by Andrea / 2024</p><h1 id="wc-project-title">#WeCount</h1></div>
        <div className="wc-project-description"><p>Making the impact of abortion bans visible.</p><p>A public-facing data visualization for the Society of Family Planning, translating state-by-state research into an accessible, interactive view.</p><p className="wc-kicker">Data visualization / Campaign / Information design</p></div>
      </section>
      <WeCountExplorer />
      <footer className="wc-page-footer"><span>Analog Future</span><a href="/#work">Explore more work <span aria-hidden="true">↗</span></a></footer>
    </main>
  );
}
