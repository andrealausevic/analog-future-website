import type { Metadata } from "next";
import WeCountExplorer from "@/components/wecount/explorer";
import { CaseStudyFooter } from "@/components/site/case-study-footer";
import { ProjectNavigation } from "@/components/site/project-navigation";
import "./wecount.css";

export const metadata: Metadata = {
  title: "#WeCount — Analog Future",
  description: "An interactive view of the Society of Family Planning’s #WeCount research, tracking abortion access after Dobbs.",
};

export default function WeCountPage() {
  return (
    <main className="wc-page">
      <ProjectNavigation />
      <section className="wc-project-intro" aria-labelledby="wc-project-title">
        <div className="wc-project-title-block">
          <p className="wc-kicker">#WeCount / Data visualization</p>
          <h1 id="wc-project-title">#WeCount</h1>
          <p className="wc-project-tagline">Tracking abortion access after Dobbs.</p>
        </div>
        <div className="wc-project-description">
          <p className="wc-kicker">Society of Family Planning</p>
          <p className="wc-project-summary">#WeCount is a public health research initiative tracking monthly, state-by-state abortion volumes across the United States. This interactive view makes the post-Dobbs data easier to explore—showing how access shifted over time and from state to state.</p>
        </div>
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
