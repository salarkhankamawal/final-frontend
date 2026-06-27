import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, CircleDot, ArrowRight } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { listProjects } from "../../api/projects.api";
import { listIssues } from "../../api/issues.api";
import { getApiErrorMessage } from "../../api/client";
import { toast } from "sonner";

function StatCard({ label, value, sub, icon: Icon, to }) {
  return (
    <Link
      to={to}
      className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <Icon size={20} />
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listProjects(), listIssues()])
      .then(([pRes, iRes]) => {
        setProjects(pRes.data || []);
        setIssues(iRes.data || []);
      })
      .catch((err) => toast.error(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const openIssues = issues.filter((i) => i.status !== "Resolved");

  if (loading) {
    return (
      <AppLayout title="Nawi Saadi tourism" subtitle="Overview of your work">
        <Spinner className="py-20" />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Nawi Saadi tourism" subtitle="Overview of your work">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="My projects"
          value={projects.length}
          sub={`${projects.filter((p) => p.status === "In Progress").length} in progress`}
          icon={FolderKanban}
          to="/projects"
        />
        <StatCard
          label="Open issues"
          value={openIssues.length}
          sub={`${issues.length} total`}
          icon={CircleDot}
          to="/issues"
        />
        <StatCard
          label="Resolved"
          value={issues.filter((i) => i.status === "Resolved").length}
          sub="completed issues"
          icon={CircleDot}
          to="/issues"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent projects</h2>
            <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              No projects yet.{" "}
              <Link to="/projects/new" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          ) : (
            <ul className="space-y-3">
              {projects.slice(0, 5).map((p) => (
                <li key={p._id}>
                  <Link
                    to={`/projects/${p._id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="text-sm font-medium text-slate-800">{p.name}</span>
                    </div>
                    <Badge type="project">{p.status}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent issues</h2>
            <Link to="/issues" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {issues.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              No issues yet.{" "}
              <Link to="/issues/new" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          ) : (
            <ul className="space-y-3">
              {issues.slice(0, 5).map((issue) => (
                <li key={issue._id}>
                  <Link
                    to={`/issues/${issue._id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <span className="text-xs text-slate-400 font-mono">{issue.key}</span>
                      <p className="text-sm font-medium text-slate-800 truncate">{issue.title}</p>
                    </div>
                    <Badge type="issue">{issue.status}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
