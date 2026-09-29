import {
  ArrowRight,
  Boxes,
  Check,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Building2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const workflow = ["Organization", "Board", "Section", "Task"];

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="dashboard-screen min-h-screen">
      <header className="dashboard-topbar mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/dashboard" className="home-brand" aria-label="Team Quest dashboard">
          <span className="home-brand-mark grid place-items-center">
            <Gamepad2 aria-hidden="true" size={22} />
          </span>
          <span>
            <span className="home-brand-name">Team Quest</span>
            <span className="home-brand-caption">PLAYER DASHBOARD</span>
          </span>
        </Link>
        <div className="dashboard-top-actions">
          <span className="dashboard-user-email" title={user?.email ?? "Player account"}>
            {user?.email ?? "Player account"}
          </span>
          <button className="dashboard-logout" type="button" onClick={handleLogout}>
            <LogOut aria-hidden="true" size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <div className="dashboard-content mx-auto w-full max-w-6xl px-5 pb-12 pt-9 sm:px-8 sm:pt-12">
        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-kicker"><LayoutDashboard aria-hidden="true" size={15} /> PLAYER HUB / 01</p>
            <h1>Welcome back.</h1>
            <p className="dashboard-welcome-copy">
              Your next move starts here. You are signed in as <strong>{user?.email ?? "Player account"}</strong>.
            </p>
          </div>
          <span className="dashboard-session"><i aria-hidden="true" /> SESSION ACTIVE</span>
        </section>

        <section className="dashboard-section" aria-labelledby="dashboard-overview-title">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-section-kicker">YOUR SPACE</p>
              <h2 id="dashboard-overview-title">Workspace overview</h2>
            </div>
            <Link to="/organisations" className="dashboard-overview-link">
              <Building2 aria-hidden="true" size={16} /> View organisations
            </Link>
          </div>

          <div className="dashboard-panels">
            <article className="dashboard-account-panel">
              <div className="dashboard-panel-icon dashboard-account-icon">
                <Check aria-hidden="true" size={20} />
              </div>
              <p className="dashboard-panel-kicker">ACCOUNT STATUS</p>
              <h3>All set to play.</h3>
              <p className="dashboard-panel-copy">Your Team Quest session is active and ready to go.</p>
              <div className="dashboard-account-detail">
                <span>Signed in as</span>
                <strong>{user?.email ?? "Player account"}</strong>
              </div>
            </article>

            <article className="dashboard-workspace-panel">
              <div className="dashboard-panel-icon dashboard-workspace-icon">
                <Boxes aria-hidden="true" size={20} />
              </div>
              <p className="dashboard-panel-kicker">HOW WORK IS ORGANIZED</p>
              <h3>One clear path from plan to task.</h3>
              <p className="dashboard-panel-copy">
                Keep a team’s projects together, split work into boards and sections, then track tasks in context.
              </p>
              <ol className="dashboard-workflow" aria-label="Organization, board, section, task">
                {workflow.map((step, index) => (
                  <li key={step}>
                    <span>{step}</span>
                    {index < workflow.length - 1 && <ArrowRight aria-hidden="true" size={13} />}
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </section>

        <section className="dashboard-next-step" aria-label="Continue exploring Team Quest">
          <div>
            <p className="dashboard-section-kicker">READY FOR THE NEXT QUEST?</p>
            <h2>See what your workspace can become.</h2>
          </div>
          <Link to="/" className="dashboard-explore-link">
            Explore Team Quest <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </section>

        <footer className="dashboard-footer">
          <span>TEAM QUEST <span aria-hidden="true">/</span> PLAYER DASHBOARD</span>
          <span>ONE QUEST AT A TIME</span>
        </footer>
      </div>
    </main>
  );
}