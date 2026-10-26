---
name: design-inspiration
description: Mandatory research step before designing or redesigning any UI, page, dashboard, artifact, poster or visual. Use whenever Hamza asks for a design, a redesign, a "refresh", "make it look better", a new layout, or says the current design looks generic or unchanged. Gathers a wide spread of inspiration from Pinterest, Behance, Dribbble, LinkedIn and non-UI sources, synthesises directions, and only then designs. Inspiration is to inspire, never to duplicate.
---

# Design inspiration (research before pixels)

Hamza's rule: nothing gets designed from defaults. Every design task starts with a
deliberate inspiration sweep across several sources, a written synthesis, and a chosen
direction that can be explained. A colour swap is not a redesign.

## 1. Sweep (minimum 12 references, minimum 6 source types)

Search all of these; say which returned nothing:
- Pinterest boards (dashboard UI, telemetry UI, data-dense dark UI, fitness stats, automotive clusters)
- Behance and Dribbble (same terms plus the subject: "benchmark", "spec comparison", "hardware")
- LinkedIn posts by product designers on the subject (dense data, comparison UX, mobile charts)
- Galleries: Awwwards, Godly, Mobbin, Land-book, Siteinspire
- Non-UI sources that solve the same problem: motorsport timing screens, aircraft instrument
  clusters, audio spec sheets, console UIs (Steam Big Picture, PlayStation, Xbox), fitness apps
  (Garmin, Whoop, Strava), analytics tools (Linear, Vercel, PostHog), trading terminals
- Reviewers' own chart styles for the domain (for handhelds: Notebookcheck, GamersNexus, Digital Foundry)

For each reference record: source, genre, 2 to 4 transferable ideas (layout skeleton,
navigation, how comparison is handled, how dense numbers are handled, type scale, colour logic,
motion, small-screen adaptation) and one caution (what not to copy).

## 2. Synthesise

Write 3 candidate directions. Each has: concept paragraph, layout skeleton for desktop AND phone,
colour logic in words (what each of 5 tokens is for), a type pairing, one signature interaction.
Name which direction best serves the task's hardest use case (for benchmarks: "compare device A
vs B at the same watts on a phone").

## 3. Choose and justify

Pick one direction, say why in three sentences, and list what is borrowed from which reference
and how it is transformed. If Hamza has shown a screenshot he likes, treat it as one reference
among many, not the template.

## 4. Design rules that always apply

- Interactive and linked: hovering or tapping one data point highlights the same point on every
  other device and shows the delta. Never ship "a table with everything" as the only view.
- Mobile first in fact: 44 px touch targets, sticky headers and first columns on wide tables,
  controls in drawers, one-hand reach.
- Accessibility: 4.5:1 contrast for text, visible focus, status regions announced, colour never
  the only encoding.
- Every panel states what question it answers; every field says where the number comes from.
- Separate CONFIRMED (Hamza's own measurements) from COMMUNITY-REPORTED (reviews) from estimates.
- Hand back a short rationale with the work: direction chosen, references used, what changed
  structurally, not only colours.

## Output of this skill

A short "Design research" note (sources, references, three directions, chosen direction) saved
beside the deliverable and summarised to Hamza before building.
