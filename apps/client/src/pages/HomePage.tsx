import {
  ArrowRight,
  Check,
  CircleDashed,
  Clock3,
  CircleUserRound,
  Gamepad2,
  Layers3,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const lanes = [
  {
    title: "Up next",
    count: "02",
    icon: CircleDashed,
    className: "home-lane-next",
    tasks: [
      { title: "Map the onboarding flow", tag: "DESIGN", tone: "mint", initials: "AL" },
      { title: "Write launch checklist", tag: "PLANNING", tone: "yellow", initials: "JR" },
    ],
  },
  {
    title: "In motion",
    count: "01",
    icon: Clock3,
    className: "home-lane-active",
    tasks: [
      { title: "Build the new board view", tag: "BUILD", tone: "coral", initials: "MK" },
    ],
  },
  {
    title: "Done and dusted",
    count: "01",
    icon: Check,
    className: "home-lane-done",
    tasks: [
      { title: "Pick a name for the quest", tag: "TEAM", tone: "mint", initials: "AL" },
    ],
  },
];

export default function HomePage() {
  const token = useAuthStore((state) => state.token);

  return (
    <main className="home-screen min-h-screen">
      <header className="home-topbar mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="home-brand" aria-label="Team Quest home">
          <span className="home-brand-mark grid place-items-center">
            <Gamepad2 aria-hidden="true" size={22} />
          </span>
          <span>
            <span className="home-brand-name">Team Quest</span>
            <span className="home-brand-caption">CO-OP WORKSPACE</span>
          </span>
        </Link>
        <Link
          to={token ? "/dashboard" : "/login"}
          className={token ? "home-avatar-link" : "home-signin"}
          aria-label={token ? "Open dashboard" : "Sign in"}
          title={token ? "Open dashboard" : undefined}
        >
          {token ? (
            <CircleUserRound aria-hidden="true" size={23} />
          ) : (
            <>Sign in <ArrowRight aria-hidden="true" size={16} /></>
          )}
        </Link>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pt-12">
        <section className="home-intro">
          <p className="home-kicker"><Sparkles aria-hidden="true" size={15} /> YOUR TEAM, IN SYNC</p>
          <h1>Good work<br className="sm:hidden" /> deserves a good quest.</h1>
          <p className="home-lede">
            Bring plans, people, and progress together on one board.
          </p>
          <Link to={token ? "/dashboard" : "/login"} className="home-primary">
            {token ? "Open dashboard" : "Enter your workspace"}
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </section>

        <section className="home-board" aria-labelledby="board-preview-title">
          <div className="home-board-head">
            <div className="flex items-center gap-3">
              <span className="home-board-icon grid place-items-center">
                <Layers3 aria-hidden="true" size={19} />
              </span>
              <div>
                <p className="home-board-eyebrow">BOARD PREVIEW</p>
                <h2 id="board-preview-title">Launch day prep</h2>
              </div>
            </div>
            <span className="home-preview-label">SAMPLE BOARD</span>
          </div>

          <div className="home-lanes">
            {lanes.map(({ title, count, icon: Icon, className, tasks }) => (
              <section className={`home-lane ${className}`} key={title}>
                <div className="home-lane-head">
                  <span className="flex items-center gap-2">
                    <Icon aria-hidden="true" size={15} />
                    {title}
                  </span>
                  <span className="home-lane-count">{count}</span>
                </div>
                <div className="home-task-list">
                  {tasks.map((task) => (
                    <article className="home-task" key={task.title}>
                      <span className={`home-task-tag home-tag-${task.tone}`}>{task.tag}</span>
                      <h3>{task.title}</h3>
                      <div className="home-task-foot">
                        <span className="home-task-avatar" aria-label={`Assigned to ${task.initials}`}>
                          {task.initials}
                        </span>
                        <span className="home-task-lines" aria-hidden="true"><i /><i /></span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="home-board-foot">
            <span>ONE QUEST AT A TIME</span>
            <span className="home-online"><i aria-hidden="true" /> READY WHEN YOU ARE</span>
          </div>
        </section>

        <section className="home-details" aria-labelledby="home-details-title">
          <div className="home-details-intro">
            <p className="home-details-kicker">HOW WORK FITS TOGETHER</p>
            <h2 id="home-details-title">From the big picture to the next step.</h2>
            <p>
              A simple structure keeps every project easy to follow, from the team space down to the task at hand.
            </p>
          </div>

          <ol className="home-hierarchy" aria-label="Organization, board, section, task">
            <li>Organization</li>
            <li>Board</li>
            <li>Section</li>
            <li>Task</li>
          </ol>

          <div className="home-details-grid">
            <article>
              <span className="home-detail-index">01 / WORKSPACE</span>
              <h3>Keep projects together</h3>
              <p>Start with an organization, then gather related project boards under one roof.</p>
            </article>
            <article>
              <span className="home-detail-index">02 / BOARD</span>
              <h3>Give each project a path</h3>
              <p>Create a board for a project and break its workflow into clear, named sections.</p>
            </article>
            <article>
              <span className="home-detail-index">03 / TASK</span>
              <h3>Keep the next step clear</h3>
              <p>Capture work with a title and description, then group each task in the right section.</p>
            </article>
          </div>
        </section>

        <footer className="home-footer">
          <span>MAKE ROOM FOR THE GOOD IDEAS.</span>
          <span>TEAM QUEST <span aria-hidden="true">/</span> 01</span>
        </footer>
      </div>
    </main>
  );
}