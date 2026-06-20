# StudyCircle — V1 / V2 / V3 Product Plan
## SOC-0312 · Shikho 2026 Roadmap

---

## The Bet

The biggest headroom for Shikho is **activation** — turning registered students into students who have completed their first content session. The Free-Trial path converts to paid several times better than direct purchase. The paid base is strongest in Class 9–12.

**The insight:** Students who feel *socially accountable* — to a group, a goal, a peer — are more likely to show up. StudyCircle is the social layer that creates that accountability at the exact moment it's needed most: right after signup, before the first lesson.

**The v1 bet:** If a new student is matched into a small, relevant study circle during onboarding, they will be more likely to start their first lesson, come back, and stay engaged — because the product gives them belonging and accountability, not just content.

---

## V1 — *Ship Now* · Validate the Match-to-Activation Hypothesis

**What v1 is:** An AI concierge onboarding that connects new students to a matched study circle in under 60 seconds.

**Why this specific cut:**
- Activation is the highest-leverage gap. V1 intervenes at the registration → first lesson drop-off moment.
- A matched, small group (8–16 students) is the minimum unit of social accountability. Anything larger loses intimacy; anything smaller has no momentum.
- The concierge makes the match feel *earned* and personal — not a random room assignment.

### What ships in V1

| Feature | What it does |
|---------|-------------|
| **AI Concierge Onboarding** | 5-question rule-based chat (class, goal, weak subjects, study time, language). Produces a profile. |
| **Match Engine** | Scores circles on class fit (40pts), goal alignment (30pts), subject overlap (20pts), time match (10pts). Returns top 3. |
| **Circle Recommendations** | 3 cards with match %, reasons ("বিষয় মিলেছে: গণিত"), member count, next session time. |
| **Circle Home** | Hero with stats, member list with streaks + online indicators, activity feed, next session banner. |
| **Activity Feed Actions** | Post "পড়েছি / আটকেছি / আসো পড়ি" — minimal, specific, high-signal. |
| **Reactions** | Tap to react to any feed item. Simple acknowledgement loop. |
| **State Persistence** | localStorage — join a circle, leave, come back. It's still there. |
| **Leave & Rejoin** | Confirmation flow. Rejoining shows the recommendations page again. |
| **StudyCircle tab in nav** | Appears only after joining. Green pulse indicator when circle is active. |

### What does NOT ship in V1

- No public forums or open chat
- No real-time messaging (WebSocket)
- No push notifications
- No creator tools or teacher involvement
- No advanced moderation
- No leaderboards
- No server-side AI (rule-based is sufficient to validate the hypothesis)

### V1 Success Metrics

| Metric | Target |
|--------|--------|
| Signup → circle-join rate | > 40% of users who see concierge |
| Circle-join → first lesson play | > 60% (vs. ~X% baseline) |
| 7-day return rate (circle members) | > 50% |
| Activity feed action rate (week 1) | > 30% of joined members post at least once |

---

## V2 — *Strengthen the Habit Loop* · Prove Social Accountability = Retention

**When:** After v1 validates the match → activation link. Target: 4–6 weeks post v1 launch.

**The shift:** V1 gets students into a circle. V2 makes them *come back because of the circle*.

### V2 Features

**Weekly rhythm layer**
- Shared weekly goal that the whole circle commits to on Monday
- Thursday mid-week check-in nudge ("তোমার সার্কেল ৭০% সম্পন্ন — তুমি?")
- Sunday recap: who hit their goal, group streak count

**Peer nudges**
- "তোমার সার্কেল এখন পড়ছে" — passive awareness push
- Lightweight reactions to nudges (👋 = I'm coming)
- "আটকেছি" response thread — peers can reply with help

**Session scheduling**
- A member can propose a study time → others tap to confirm
- Calendar block (ICS export)
- 15-min reminder notification

**Better matching signals**
- Use actual lesson-play data (which chapters opened, completion %)
- Re-match after 2 weeks if circle is inactive
- "Match quality" score improves over time as behavioral signals accumulate

### V2 Success Metrics

| Metric | Direction |
|--------|-----------|
| Weekly active users in circles | ↑ vs. V1 baseline |
| Interactions per student per week | > 3 |
| Session attendance rate | > 50% of proposed sessions |
| Course chapter completion lift | +20% for circle members vs. non-members |

---

## V3 — *Scale the System* · Community as a Growth Engine

**When:** After V2 retention data is strong. Target: 3–4 months post V2.

**The shift:** StudyCircle stops being a feature and becomes a distribution channel — students bring other students in.

### V3 Features

**Multiple circle types**
- Exam sprint circles (SSC/HSC countdown, fixed end date)
- Weak-subject focus circles (auto-dissolved once subject is completed)
- Same-time study rooms (study together in silence, accountability call)
- Admission prep cohorts (medical, engineering, public university tracks)

**Smarter AI matching**
- Model trained on circle engagement data (not just profile answers)
- Predicts circle success probability before recommending
- Auto-suggests circle migration if current circle goes inactive

**Referral loops**
- "তোমার বন্ধুকে আমন্ত্রণ জানাও" — shared circle invite link
- Referral credit (unlocks premium content for both referrer and new member)
- Public circle discovery for students not yet onboarded

**Moderation & trust**
- AI-flagged toxic/off-topic activity (rule-based first, ML later)
- Student-elected circle captain
- Reporting and appeal flow

**Analytics for Shikho**
- Circle health score per group
- Activation lift dashboard (circle vs. non-circle cohorts)
- Retention curves segmented by circle type

### V3 Success Metrics

| Metric | Direction |
|--------|-----------|
| Referrals per active student | > 1.5 per month |
| Match → active circle conversion | > 70% |
| Retention lift (circle vs. non-circle) | +30% at 30 days |
| Reduction in early dropout (< 7 days) | -25% |

---

## The Calls Made for V1

**Why rule-based AI, not LLM?**
The concierge asks 5 fixed questions with structured choices. A rule engine scores the answers with deterministic weights. This means: (a) zero hallucination risk, (b) zero latency waiting for an API, (c) the matching logic is auditable and tunable based on v1 data. An LLM adds cost and complexity with no accuracy gain for this specific task.

**Why localStorage, not a backend?**
V1 is a prototype to validate a hypothesis. Introducing a backend adds weeks and compliance overhead before we know if the feature moves activation at all. localStorage is sufficient for the pilot cohort and can be migrated to a proper backend (user session + server-side state) once the signal is clear.

**Why small circles (8–16) not large communities?**
Research consistently shows that accountability and social presence collapse in groups over ~20. A student in a 500-person Discord server does not feel missed when they skip a day. A student in a 10-person circle does. The activation goal requires felt accountability — that means small groups.

**Why activity feed actions are only "পড়েছি / আটকেছি / আসো পড়ি"?**
These three signals are high-information and low-friction. They tell the group something useful (studying, needs help, wants company) without requiring a student to write a paragraph. Full text chat is a V2 consideration once we know the circle is alive.

---

## One-Line Thesis

StudyCircle is not a social feature for its own sake — it is a personalized learning connection layer that helps students reach the first lesson, stay engaged, and return more often.
