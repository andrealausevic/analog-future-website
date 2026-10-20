import type { Metadata } from "next";
import { CaseStudyFooter } from "@/components/site/case-study-footer";
import { ProjectNavigation } from "@/components/site/project-navigation";
import "./cadence.css";

export const metadata: Metadata = {
  title: "Cadence — Analog Future",
  description:
    "Cadence is a reflective record for remembering everyday life and seeing its patterns over time.",
};

const challenges = [
  ["01", "Life is fragmented", "Work, rest, movement, relationships, and routines are tracked in separate places—or not at all."],
  ["02", "Hard to see", "Daily choices are easy to record, but difficult to understand as a connected pattern."],
  ["03", "Easy to lose balance", "Without a longer view, small shifts accumulate before we notice what is changing."],
] as const;

const journey = [
  ["01", "Capture", "Add a moment in seconds, without interrupting it."],
  ["02", "Connect", "Bring time, activity, mood, and context into one record."],
  ["03", "Reflect", "Move between a day, a week, and a year to reveal patterns."],
  ["04", "Adjust", "Use what becomes visible to make more intentional choices."],
] as const;

const scope = [
  "Product strategy",
  "Experience design",
  "Brand identity",
  "UX / UI design",
  "Design system",
  "Product development",
] as const;

export default function CadencePage() {
  return (
    <main className="cadence-page" id="top">
      <ProjectNavigation />

      <section className="cadence-hero project-wrap">
        <div className="cadence-hero__intro">
          <p className="project-kicker">01 / Cadence</p>
          <h1>Cadence</h1>
          <div className="cadence-hero__copy">
            <p className="project-kicker">Product strategy · Identity · UX / UI · Design system</p>
          </div>
        </div>
        <div className="cadence-hero__media" aria-label="Cadence visual identity">
          <img src="/assets/home/cadence.png" alt="Blue Cadence lines folding through time." />
          <div className="cadence-hero__mark"><span>C</span><strong>Cadence</strong></div>
        </div>
        <p className="cadence-hero__description">We built Cadence because we wanted to remember our lives better—to return to a random Tuesday and see what we did. Not only work, but the things that make up a life: how we felt, what we read or watched, what we spent, and the thoughts we wrote down. Over time, these details reveal the patterns of our lives.</p>
      </section>

      <section className="cadence-challenge project-section project-wrap">
        <div className="project-section__heading">
          <p className="project-kicker">The challenge</p>
          <h2>Modern life moves fast.</h2>
          <p>But the tools used to understand it rarely show the whole picture.</p>
        </div>
        <div className="cadence-challenge__grid">
          {challenges.map(([number, title, copy]) => (
            <article key={title}>
              <span className="project-kicker">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cadence-scale project-section project-wrap">
        <div className="cadence-scale__copy">
          <p className="project-kicker">The core experience</p>
          <h2>One system.<br />Multiple scales.</h2>
          <p>Cadence connects immediate experience with the longer view. The same information can be read as a day, a week, or a year—making repetition, change, and imbalance visible.</p>
        </div>
        <div className="cadence-scale__media">
          <img src="/work/cadence-thumbnail.png" alt="Cadence daily, weekly, and yearly product views." />
          <div className="cadence-scale__captions project-kicker"><span>Daily view</span><span>Weekly view</span><span>Yearly view</span></div>
        </div>
      </section>

      <section className="cadence-journey project-section project-wrap">
        <div className="project-section__heading project-section__heading--compact">
          <p className="project-kicker">The product journey</p>
          <h2>From a moment to a pattern.</h2>
        </div>
        <ol>
          {journey.map(([number, title, copy]) => (
            <li key={title}>
              <span className="cadence-dot" aria-hidden="true" />
              <span className="project-kicker">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="cadence-analytics project-section project-wrap">
        <div className="cadence-analytics__heading">
          <p className="project-kicker">Patterns become visible</p>
          <h2>Analysis without turning life into a dashboard.</h2>
          <p>The interface reveals relationships between time, energy, attention, and everyday activity while keeping reflection human and legible.</p>
        </div>
        <div className="cadence-analytics__media">
          <img src="/work/cadence.jpg" alt="Three Cadence interface screens showing daily, weekly, and yearly records." />
        </div>
      </section>

      <section className="cadence-long-view project-section project-wrap">
        <div className="cadence-long-view__copy">
          <p className="project-kicker">Analysis over time</p>
          <h2>A longer view changes what you notice.</h2>
          <p>Cadence builds a personal record gradually. Instead of scoring individual days, it helps people see the rhythms shaping their lives—and how those rhythms evolve.</p>
        </div>
        <div className="cadence-long-view__visual">
          <img src="/assets/home/cadence.png" alt="Cadence longitudinal pattern visualization." />
          <div className="cadence-long-view__legend project-kicker"><span>Sleep</span><span>Work</span><span>Meals</span><span>Create</span><span>Friends</span></div>
        </div>
      </section>

      <section className="cadence-identity project-section project-wrap">
        <div className="project-section__heading project-section__heading--compact">
          <p className="project-kicker">Identity system</p>
          <h2>Built from rhythm, repetition, and change.</h2>
        </div>
        <div className="cadence-identity__grid">
          <div className="cadence-identity__mark"><span>C</span><strong>Cadence</strong></div>
          <div className="cadence-identity__blue"><span className="project-kicker">Cadence blue</span><strong>#6C95EF</strong></div>
          <div className="cadence-identity__charcoal"><span className="project-kicker">Charcoal</span><strong>#17171C</strong></div>
          <div className="cadence-identity__type"><span className="project-kicker">Marmelad</span><strong>Aa</strong></div>
          <div className="cadence-identity__icons" aria-label="Cadence activity categories"><span>○</span><span>□</span><span>△</span><span>◇</span><span>＋</span><span>≈</span></div>
        </div>
      </section>

      <section className="cadence-scope project-section project-wrap">
        <div className="project-section__heading project-section__heading--compact">
          <p className="project-kicker">A complete product system</p>
          <h2>Conceived, designed, and developed by Analog Future.</h2>
        </div>
        <div className="cadence-scope__grid">
          {scope.map((item, index) => <div key={item}><span className="project-kicker">0{index + 1}</span><p>{item}</p></div>)}
        </div>
      </section>

      <CaseStudyFooter
        statement="Cadence makes the patterns shaping everyday life visible."
        nextTitle="Coolbuilding"
        nextHref="/work/coolbuilding"
      />
    </main>
  );
}
