import { useEffect, useRef, useState } from "react";

const REPO_URL =  import.meta.env.VITE_GITHUB_REPO_URL;
const INSTALL_URL = import.meta.env.VITE_GITHUB_APP_INSTALL_URL;

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ as: Tag = "div", className = "", children, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity .7s ease, transform .7s ease",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

const PIPELINE_STEPS = [
  {
    num: "01",
    title: "PR Opened",
    desc: "Developer opens or pushes to a pull request on GitHub.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a5 5 0 00-5 5v2H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2v-9a2 2 0 00-2-2h-2V7a5 5 0 00-5-5z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Webhook Fired",
    desc: "GitHub sends a signed pull_request event to the app's endpoint.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12l6 6L20 6" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Signature Verified",
    desc: "HMAC-SHA256 signature checked before any processing begins.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 018 0v3" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Pending Comment Posted",
    desc: '"Review in progress..." appears on the PR immediately.',
    icon: <span>⏳</span>,
  },
  {
    num: "05",
    title: "Diff Fetched",
    desc: "Changed files pulled via Octokit; binary and lock files filtered out.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12l2 2 4-4" />
        <rect x="3" y="4" width="18" height="16" rx="2" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Parallel LLM Review",
    desc: "Each file reviewed simultaneously via LangChain chains, not sequentially.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 4v16M16 4v16M4 8h4M16 8h4M4 16h4M16 16h4" />
      </svg>
    ),
  },
  {
    num: "07",
    title: "Synthesis",
    desc: "All file reviews merged into one cohesive structured summary.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M2 12h20" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    num: "08",
    title: "Comment Updated",
    desc: "PR comment updated in-place with the final review, issues, and verdict.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-4M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    label: "[ PARALLEL REVIEW ]",
    desc: "Analyzes every changed file simultaneously using LangChain parallel chains. Not sequential — N files take the same time as 1.",
  },
  {
    label: "[ INSTANT FEEDBACK ]",
    desc: "Posts a placeholder comment the moment the webhook arrives. PR author knows the bot is working within seconds.",
  },
  {
    label: "[ SMART DEDUPLICATION ]",
    desc: "Never spams the PR thread. On force pushes, updates the existing comment in-place rather than creating a new one.",
  },
  {
    label: "[ SIGNATURE VERIFICATION ]",
    desc: "Rejects any request that isn't signed by GitHub using HMAC-SHA256. No unauthorized triggers.",
  },
  {
    label: "[ ASYNC PROCESSING ]",
    desc: "Responds to GitHub within 10 seconds, required, and processes the review in the background. Zero dropped webhooks.",
  },
  {
    label: "[ CONFIGURABLE MODEL ]",
    desc: "Swap between Gemini 2.5, Gemini 2.5 Flash, or any Google Gemini model via a single env var. No code changes needed.",
  },
];

const TECH = ["Node.js", "Express", "LangChain", "Google Gemini", "Octokit", "GitHub Apps API", "HMAC-SHA256", "Render"];

const colors = {
  bg: "#0a0a0a",
  bgRaised: "#111111",
  line: "#1f1f1f",
  lineStrong: "#2a2a2a",
  orange: "#f97316",
  orangeGlow: "rgba(249,115,22,0.35)",
  text: "#f4f4f3",
  textDim: "#9a9a97",
  textDimmer: "#6b6b68",
};

function PipelineNode({ step }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="pipeline-node"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity .7s ease, transform .7s ease",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="step-num">{step.num}</span>
        <span className="icon-box">{step.icon}</span>
      </div>
      <h3 className="mono font-semibold text-sm mb-1.5">{step.title}</h3>
      <p className="text-sm" style={{ color: colors.textDim }}>
        {step.desc}
      </p>
    </div>
  );
}

export default function AIPRReviewerLanding() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: colors.bg, color: colors.text, minHeight: "100vh" }} className="antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .aipr-root, .aipr-root * { box-sizing: border-box; }
        .aipr-root { font-family: 'Inter', sans-serif; scroll-behavior: smooth; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        .aipr-root ::selection { background: ${colors.orange}; color: #0a0a0a; }

        .btn-solid {
          background: ${colors.orange};
          color: #0a0a0a;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          transition: transform .15s ease, box-shadow .25s ease, background-color .2s ease;
          display: inline-block;
        }
        .btn-solid:hover { background: #fb923c; box-shadow: 0 0 24px ${colors.orangeGlow}; transform: translateY(-1px); }

        .btn-outline {
          background: transparent;
          color: ${colors.text};
          border: 1px solid ${colors.lineStrong};
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          transition: border-color .2s ease, color .2s ease, box-shadow .25s ease, transform .15s ease;
          display: inline-block;
        }
        .btn-outline:hover { border-color: ${colors.orange}; color: ${colors.orange}; box-shadow: 0 0 18px rgba(249,115,22,0.15); transform: translateY(-1px); }

        #aipr-navbar { position: sticky; top: 0; z-index: 50; border-bottom: 1px solid transparent; transition: background-color .4s ease, border-color .4s ease, backdrop-filter .4s ease; }
        #aipr-navbar.scrolled { background: rgba(10,10,10,0.72); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid ${colors.line}; }

        .hero-section { position: relative; overflow: hidden; }
        .grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 44px 44px;
          -webkit-mask-image: radial-gradient(ellipse 70% 55% at 50% 20%, black 40%, transparent 90%);
          mask-image: radial-gradient(ellipse 70% 55% at 50% 20%, black 40%, transparent 90%);
          animation: drift 30s linear infinite;
        }
        @keyframes drift { 0% { background-position: 0 0, 0 0; } 100% { background-position: 44px 44px, 44px 44px; } }
        .ember-glow {
          position: absolute; width: 900px; height: 900px; top: -450px; left: 50%; transform: translateX(-50%);
          background: radial-gradient(circle, ${colors.orangeGlow} 0%, transparent 62%);
          opacity: 0.35; pointer-events: none;
        }

        .badge { display: inline-flex; align-items: center; gap: .5rem; border: 1px solid ${colors.lineStrong}; background: rgba(249,115,22,0.06); color: ${colors.orange}; font-size: 0.72rem; letter-spacing: 0.08em; padding: .4rem .8rem; border-radius: 999px; }
        .badge .dot { width: 6px; height: 6px; border-radius: 999px; background: ${colors.orange}; box-shadow: 0 0 8px ${colors.orange}; }

        .typewriter {
          display: inline-block; overflow: hidden; white-space: nowrap;
          border-right: 2px solid ${colors.orange};
          animation: typing 2.1s steps(38, end) 1 forwards, blink-caret 0.85s step-end infinite;
          max-width: 0;
        }
        @keyframes typing { from { max-width: 0; } to { max-width: 100%; } }
        @keyframes blink-caret { 0%, 100% { border-color: ${colors.orange}; } 50% { border-color: transparent; } }

        .section-label { font-family: 'JetBrains Mono', monospace; color: ${colors.orange}; font-size: 0.72rem; letter-spacing: 0.14em; display: inline-block; margin-bottom: 0.9rem; }

        .pipeline-node {
          position: relative; border: 1px solid ${colors.line};
          background: linear-gradient(180deg, rgba(255,255,255,0.015), transparent);
          border-radius: 14px; padding: 1.4rem 1.3rem;
          transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
        }
        .pipeline-node:hover { border-color: rgba(249,115,22,0.55); box-shadow: 0 0 30px rgba(249,115,22,0.12); transform: translateY(-2px); }
        .pipeline-node .step-num { font-family: 'JetBrains Mono', monospace; color: ${colors.orange}; font-size: 0.85rem; letter-spacing: 0.05em; }
        .pipeline-node .icon-box { width: 34px; height: 34px; border: 1px solid ${colors.lineStrong}; border-radius: 9px; display: flex; align-items: center; justify-content: center; color: ${colors.orange}; flex-shrink: 0; }

        .pipe-line-h { height: 1px; background: linear-gradient(90deg, transparent, ${colors.lineStrong} 15%, ${colors.lineStrong} 85%, transparent); position: relative; }
        .pipe-line-h::after { content: ''; position: absolute; right: 0; top: 50%; width: 6px; height: 6px; background: ${colors.orange}; border-radius: 999px; transform: translateY(-50%); box-shadow: 0 0 8px ${colors.orange}; }
        .pipe-line-v { width: 1px; background: linear-gradient(180deg, transparent, ${colors.lineStrong} 15%, ${colors.lineStrong} 85%, transparent); margin: 0 auto; position: relative; }
        .pipe-line-v::after { content: ''; position: absolute; bottom: 0; left: 50%; width: 6px; height: 6px; background: ${colors.orange}; border-radius: 999px; transform: translateX(-50%); box-shadow: 0 0 8px ${colors.orange}; }

        .gh-comment { background: ${colors.bgRaised}; border: 1px solid ${colors.line}; border-radius: 14px; overflow: hidden; }
        .gh-comment-header { background: #0d0d0d; border-bottom: 1px solid ${colors.line}; }
        .bot-avatar { width: 32px; height: 32px; border-radius: 8px; background: conic-gradient(from 180deg, ${colors.orange}, #7c2d12, ${colors.orange}); flex-shrink: 0; }
        .gh-comment .md h2 { font-family: 'JetBrains Mono', monospace; font-size: 1.05rem; color: ${colors.text}; margin: 0 0 1rem 0; }
        .gh-comment .md h3 { font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; letter-spacing: 0.06em; color: ${colors.orange}; text-transform: uppercase; margin: 1.4rem 0 0.6rem 0; }
        .gh-comment .md p, .gh-comment .md li { color: #c9c9c6; font-size: 0.92rem; line-height: 1.65; }
        .gh-comment .md code { font-family: 'JetBrains Mono', monospace; background: rgba(255,255,255,0.06); border: 1px solid ${colors.lineStrong}; padding: 0.1rem 0.4rem; border-radius: 5px; font-size: 0.82rem; color: #fbbf85; }
        .verdict-pill { display: inline-flex; align-items: center; gap: .5rem; background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.4); color: ${colors.orange}; padding: .4rem .9rem; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }

        .screenshot-placeholder { border: 1.5px dashed ${colors.lineStrong}; border-radius: 12px; background: repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 10px, transparent 10px, transparent 20px); }

        .feature-card { border: 1px solid ${colors.line}; border-top: 2px solid ${colors.orange}; background: linear-gradient(180deg, rgba(255,255,255,0.015), transparent); border-radius: 10px; transition: transform .2s ease, box-shadow .25s ease, border-color .2s ease; }
        .feature-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.4), 0 0 26px rgba(249,115,22,0.1); border-color: ${colors.lineStrong}; }

        .chip { font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; border: 1px solid ${colors.lineStrong}; color: ${colors.textDim}; padding: .5rem 1rem; border-radius: 999px; white-space: nowrap; transition: color .2s ease, border-color .2s ease; }
        .chip:hover { color: ${colors.orange}; border-color: ${colors.orange}; }

        .divider { height: 1px; background: linear-gradient(90deg, transparent, ${colors.line} 20%, ${colors.line} 80%, transparent); }

        @media (prefers-reduced-motion: reduce) {
          .aipr-root * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      <div className="aipr-root">
        {/* NAVBAR */}
        <nav id="aipr-navbar" className={scrolled ? "scrolled" : ""}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="mono font-bold tracking-tight" style={{ color: colors.orange }}>
              [ CodeMyWar - AI PR Reviewer ]
            </span>
            <div className="flex items-center gap-3">
              <a href={REPO_URL} className="btn-outline text-xs px-4 py-2 rounded-md">
                View on GitHub
              </a>
              <a href={INSTALL_URL} className="btn-solid text-xs px-4 py-2 rounded-md">
                Install App
              </a>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero-section pt-24 pb-28 px-6">
          <div className="grid-bg" />
          <div className="ember-glow" />
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="badge mono">
              <span className="dot" />
              GITHUB APP · PRODUCTION DEPLOYED
            </span>

            <h1 className="mt-8 text-sm sm:text-5xl md:text-4xl font-extrabold leading-tight tracking-tight">
              <span className="typewriter">Your codebase deserves a second opinion.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: colors.textDim }}>
              AI PR Reviewer watches every pull request, runs a multi-stage LangChain pipeline across all changed
              files in parallel, and posts one structured review — bugs, security issues, suggestions, and a verdict
              — straight on the PR.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={INSTALL_URL} className="btn-solid px-7 py-3.5 rounded-md text-sm w-full sm:w-auto text-center">
                INSTALL ON GITHUB
              </a>
              <a href={REPO_URL} className="btn-outline px-7 py-3.5 rounded-md text-sm w-full sm:w-auto text-center">
                VIEW SOURCE
              </a>
            </div>

            <p className="mt-7 mono text-xs" style={{ color: colors.textDimmer }}>
              Open source · Free to self-host · Powered by LangChain + Google Gemini
            </p>
          </div>
        </section>

        <div className="divider max-w-6xl mx-auto" />

        {/* HOW IT WORKS */}
        <section className="py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-16">
              <span className="section-label">[ HOW IT WORKS ]</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">From push to verdict, fully automated</h2>
              <p className="mt-3 max-w-xl mx-auto" style={{ color: colors.textDim }}>
                Eight steps, every one of them handled without a human touching the keyboard.
              </p>
            </Reveal>

            {/* Desktop horizontal pipeline */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-4 gap-x-4">
                {PIPELINE_STEPS.slice(0, 4).map((step) => (
                  <PipelineNode key={step.num} step={step} />
                ))}
              </div>
              <div className="grid grid-cols-4 gap-x-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="pipe-line-h my-4" />
                ))}
              </div>
              <div className="grid grid-cols-4 gap-x-4">
                {PIPELINE_STEPS.slice(4, 8).map((step) => (
                  <PipelineNode key={step.num} step={step} />
                ))}
              </div>
            </div>

            {/* Mobile vertical pipeline */}
            <div className="lg:hidden">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={step.num}>
                  <PipelineNode step={step} />
                  {i < PIPELINE_STEPS.length - 1 && <div className="pipe-line-v h-8" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider max-w-6xl mx-auto" />

        {/* OUTPUT */}
        <section className="py-28 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-12">
              <span className="section-label">[ OUTPUT ]</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What the review looks like</h2>
            </Reveal>

            <Reveal className="gh-comment">
              <div className="gh-comment-header px-5 py-4 flex items-center gap-3">
                <div className="bot-avatar" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="mono text-sm font-semibold">code-my-war[bot]</span>
                    <span
                      className="mono rounded"
                      style={{ fontSize: "10px", padding: "2px 6px", background: "rgba(255,255,255,0.07)", color: colors.textDim }}
                    >
                      Bot
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: colors.textDimmer }}>
                    commented just now
                  </span>
                </div>
              </div>

              <div className="md px-5 py-6">
                <h2>🤖 AI PR Review</h2>

                <h3>Summary</h3>
                <p>
                  This PR adds JWT authentication middleware and a user login endpoint. The core logic looks solid
                  but there are a few security issues worth addressing before merging.
                </p>

                <h3>Issues Found</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <code>src/middleware/auth.js</code>: JWT secret is hardcoded as a string literal on line 12 —
                    should be read from <code>process.env.JWT_SECRET</code>
                  </li>
                  <li>
                    <code>src/routes/auth.js</code>: Password comparison uses <code>==</code> instead of{" "}
                    <code>bcrypt.compare()</code> — vulnerable to timing attacks
                  </li>
                </ul>

                <h3>Suggestions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <code>src/middleware/auth.js</code>: Consider adding token expiry validation
                  </li>
                  <li>
                    <code>src/routes/auth.js</code>: Add rate limiting to the <code>/login</code> endpoint
                  </li>
                </ul>

                <h3>Verdict</h3>
                <span className="verdict-pill">🚨 Needs Major Changes</span>
              </div>
            </Reveal>

            <p className="mono text-xs text-center mt-4" style={{ color: colors.orange }}>
              [ ACTUAL OUTPUT · RENDERED ON GITHUB ]
            </p>

            <Reveal className="mt-6 screenshot-placeholder h-full flex items-center justify-center">
              {/* REPLACE WITH ACTUAL SCREENSHOT */}
              <img
                src="/screenshot-placeholder.png"
                alt="Real screenshot of AI PR Reviewer comment on GitHub — replace src with your own screenshot"
                className="max-h-full max-w-full"
              />
              {/* <span className="mono text-xs" style={{ color: colors.textDimmer }}>
                drop a real screenshot here — REPLACE WITH ACTUAL SCREENSHOT
              </span> */}
            </Reveal>
          </div>
        </section>

        <div className="divider max-w-6xl mx-auto" />

        {/* FEATURES */}
        <section className="py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-14">
              <span className="section-label">[ KEY FEATURES ]</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for real repos, not demos</h2>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <Reveal key={f.label} className="feature-card p-6">
                  <h3 className="mono text-sm font-semibold mb-2" style={{ color: colors.orange }}>
                    {f.label}
                  </h3>
                  <p className="text-sm" style={{ color: colors.textDim }}>
                    {f.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="divider max-w-6xl mx-auto" />

        {/* TECH STACK */}
        <section className="py-20 px-6">
          <Reveal className="max-w-6xl mx-auto text-center">
            <span className="section-label">[ BUILT WITH ]</span>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {TECH.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* FOOTER */}
        <footer className="px-6 py-10" style={{ borderTop: `1px solid ${colors.line}` }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <span className="mono font-bold" style={{ color: colors.orange }}>
              [ CodeMyWar - AI PR Reviewer ]
            </span>

            <p className="text-sm" style={{ color: colors.textDim }}>
              Built by{" "}
              <a href="https://aryansrivastava.me" className="underline">
                Aryan Srivastava
              </a>
            </p>

            <div className="flex items-center gap-5 text-sm mono">
              <a href={REPO_URL} style={{ color: colors.textDim }}>
                [ VIEW ON GITHUB ]
              </a>
              <a href={INSTALL_URL} style={{ color: colors.textDim }}>
                [ INSTALL APP ]
              </a>
            </div>
          </div>
          {/* <p className="text-center mt-6 text-xs mono" style={{ color: colors.textDimmer }}>
            Open source · MIT License
          </p> */}
        </footer>
      </div>
    </div>
  );
}
