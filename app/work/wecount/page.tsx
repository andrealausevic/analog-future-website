import type { Metadata } from "next";
import WeCountExplorer from "@/components/wecount/explorer";
import { CaseStudyFooter } from "@/components/site/case-study-footer";
import { ProjectNavigation } from "@/components/site/project-navigation";
import "./wecount.css";

export const metadata: Metadata = {
  title: "#WeCount — Analog Future",
  description: "An interactive reconstruction of Andrea Lausevic’s #WeCount data visualization, using published historical estimates from the Society of Family Planning.",
};

export default function WeCountPage() {
  return (
    <main className="wc-page">
      <ProjectNavigation />
      <section className="wc-project-intro" aria-labelledby="wc-project-title">
        <div><p className="wc-kicker">Selected work by Andrea / 2024</p><h1 id="wc-project-title">#WeCount</h1></div>
        <div className="wc-project-description"><p>Making the impact of abortion bans visible.</p><p>A public-facing data visualization for the Society of Family Planning, translating state-by-state research into an accessible, interactive view.</p><p className="wc-kicker">Data visualization / Campaign / Information design</p></div>
      </section>
      <WeCountExplorer />
      <CaseStudyFooter
        statement="We transformed spreadsheets of monthly estimates into an interactive national view—making shifts in abortion access visible across time, geography, and legal context."
        nextTitle="SimpleSite"
        nextHref="/work/simplesite"
      />
    </main>
  );
}
