export const links = {
  github: 'https://github.com/kowo-co/beckett',
  githubApp: 'https://github.com/apps/0x-beck',
  kowoOrg: 'https://github.com/kowo-co',
  discord: 'https://discord.gg/beckett',
  install: 'curl -fsSL https://raw.githubusercontent.com/kowo-co/beckett/main/install.sh | bash',
} as const

export const hero = {
  eyebrow: 'Beckett · Coworker as a Service',
  headline: ['Hire a coworker.', 'Not a tool.'],
  subhead:
    'Beckett is Coworker as a Service. It lives in your Discord, takes work in plain language, opens the pull request, reviews its own diff, and deploys. Open source, MIT, running on hardware you own.',
  thesis:
    'SaaS sold you tools. Chatbots sold you answers. Both left the work exactly where it was. Coworker as a Service is the honest next step: you hand over the outcome, not the keystrokes.',
} as const

export const workflow = {
  title: 'Ask in the channel. Get a pull request.',
  intro:
    "There is no board to groom and no plan to approve. v7 deleted the ticket tracker outright — you ask, it builds, and the run's card in the channel is the receipt.",
  steps: [
    {
      title: 'You ask',
      body: 'Mention it in the channel you\'re already in, in plain language. It sizes the ask itself: a sentence back, or real work.',
    },
    {
      title: 'It staffs the work',
      body: 'One call deploys a run. A supervisor cuts an isolated worktree and a branch, writes a spec.md checklist, and puts a coding agent on it — which cannot finish with items left unticked.',
    },
    {
      title: 'It ships',
      body: 'A fresh reviewer grinds the diff against that same checklist. A pass publishes the branch and opens the PR. A fail goes back for rework, a bounded number of times.',
    },
  ],
} as const

export const features = {
  title: 'Everything a good hire has. None of the onboarding.',
  items: [
    {
      title: 'It answers to you in Discord',
      body: 'Every channel and DM gets its own session, so being deep in one room never queues everyone else behind it. No dashboard to learn, no transcripts dumped in your channel.',
    },
    {
      title: 'It picks its own firepower',
      body: 'Every run is cast per stage — one model and effort level to implement, another to review. A build spanning several subsystems goes to the deepest seat and still lands as one branch, one review, one PR.',
    },
    {
      title: 'Steering that tells the truth',
      body: "Send a note to a run mid-flight and it reports which actually happened: delivered to the live worker, or buffered for the next stage. It won't tell you a nudge landed when it didn't.",
    },
    {
      title: 'It remembers you',
      body: "A cross-conversation knowledge graph, not a context window. Who you are, what you're building, and what it learned last week.",
    },
    {
      title: 'Hands past the repo',
      body: 'It generates images, provisions DNS and tunnels, deploys mockups to their own URL, and drives a real persistent Chromium for browser errands. It ships this website.',
    },
    {
      title: 'Its own GitHub identity',
      body: 'It works as beckett[bot], a GitHub App you install on the repos you pick, on installation tokens minted per call and good for an hour.',
    },
    {
      title: 'It rewrites itself',
      body: 'Its personality is one editable file. Ask it to change its vibe in Discord and it rewrites that file and reloads live — no redeploy, no pull request.',
    },
    {
      title: 'It lands its own work',
      body: 'One command takes a finished branch through PR, CI, merge and redeploy, and names the blocker at every stop instead of failing quietly.',
    },
  ],
} as const

export const fork = {
  title: "It's yours to fork.",
  body: 'One command on a box you control. It installs under its own unprivileged account as a set of systemd user services, and runs on your Claude subscription — it refuses API keys from the environment on purpose.',
  sub: 'Rename it, rewrite its persona, point it at your own Discord, and it\'s yours. MIT licensed, no permission needed.',
} as const

export const cta = {
  title: 'Go meet one.',
  body: 'Ours is in the Discord, and it will have opinions about your repo.',
} as const

export const designs = [
  {
    id: 1,
    slug: '1',
    name: 'Broadsheet',
    idea: 'A newspaper broadsheet where oversized serif type is the grid — columns, ruled lines, and drop caps on cream stock.',
    mood: 'Editorial print',
  },
  {
    id: 2,
    slug: '2',
    name: 'Receipt',
    idea: 'Brutalist system-ui honesty — monospace on stark white, harsh 1px borders, like a government form that became art.',
    mood: 'Brutalist form',
  },
  {
    id: 3,
    slug: '3',
    name: 'Shell Session',
    idea: 'A live terminal session where every section is a man-page entry and phosphor-green text is the only decoration.',
    mood: 'CLI / man-page',
  },
  {
    id: 4,
    slug: '4',
    name: 'Filmstrip',
    idea: 'Vertical scroll drives horizontal pan through narrative frames — a contact sheet where each scene is one panel.',
    mood: 'Scroll-driven cinema',
  },
  {
    id: 5,
    slug: '5',
    name: 'Constellation',
    idea: 'A generative particle field that responds to cursor movement, with content anchored in floating geometric zones.',
    mood: 'Interactive canvas',
  },
] as const
