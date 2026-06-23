import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "../../components/layout/AppLayout";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { listIssues } from "../../api/issues.api";
import { listProjects } from "../../api/projects.api";
import { getApiErrorMessage } from "../../api/client";
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from "../../utils/constants";

function IssueCard({ issue }) {
  return (
    <Link
      to={`/issues/${issue._id}`}
      className="block bg-white border border-slate-200 rounded-lg p-3 hover:border-blue-200 hover:shadow-sm transition-all"
    >
      <span className="text-xs font-mono text-slate-400">{issue.key}</span>
      <p className="text-sm font-medium text-slate-800 mt-0.5 line-clamp-2">{issue.title}</p>
      <div className="flex items-center gap-1.5 mt-2">
        <Badge type="priority">{issue.priority}</Badge>
      </div>
    </Link>
  );
}

export default function IssuesListPage() {
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("kanban");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    listProjects()
      .then((res) => setProjects(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (priorityFilter) params.priority = priorityFilter;
    if (projectFilter) params.projectId = projectFilter;

    listIssues(params)
      .then((res) => setIssues(res.data || []))
      .catch((err) => toast.error(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [statusFilter, priorityFilter, projectFilter]);

  const filtered = useMemo(() => {
    if (!query) return issues;
    const q = query.toLowerCase();
    return issues.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.key?.toLowerCase().includes(q) ||
        i.projectName?.toLowerCase().includes(q)
    );
  }, [issues, query]);

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(ISSUE_STATUSES.map((s) => [s, []]));
    filtered.forEach((issue) => {
      if (map[issue.status]) map[issue.status].push(issue);
    });
    return map;
  }, [filtered]);

  return (
    <AppLayout title="Issues" subtitle="Track and manage work items">
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 bg-white border border-slate-200 rounded-lg px-3 h-10">
          <Search size={16} className="text-slate-400" />
          <input
            className="flex-1 text-sm outline-none bg-transparent"
            placeholder="Search issues..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="h-10 border border-slate-200 rounded-lg px-3 text-sm bg-white"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
        <select
          className="h-10 border border-slate-200 rounded-lg px-3 text-sm bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {ISSUE_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="h-10 border border-slate-200 rounded-lg px-3 text-sm bg-white"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All priorities</option>
          {ISSUE_PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setView("kanban")}
            className={`px-3 py-2 text-sm ${view === "kanban" ? "bg-slate-100" : "bg-white"}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`px-3 py-2 text-sm border-l border-slate-200 ${view === "list" ? "bg-slate-100" : "bg-white"}`}
          >
            <List size={16} />
          </button>
        </div>
        <Link to="/issues/new">
          <Button variant="primary"><Plus size={16} /> New issue</Button>
        </Link>
      </div>

      {loading ? (
        <Spinner className="py-20" />
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-slate-500 mb-4">No issues found</p>
          <Link to="/issues/new">
            <Button variant="primary">Create an issue</Button>
          </Link>
        </div>
      ) : view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ISSUE_STATUSES.map((status) => (
            <div key={status} className="bg-slate-100 rounded-xl p-3 min-h-[200px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-slate-700">{status}</h3>
                <span className="text-xs text-slate-400">{byStatus[status].length}</span>
              </div>
              <div className="space-y-2">
                {byStatus[status].map((issue) => (
                  <IssueCard key={issue._id} issue={issue} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Key</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Project</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((issue) => (
                <tr key={issue._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{issue.key}</td>
                  <td className="px-4 py-3">
                    <Link to={`/issues/${issue._id}`} className="font-medium text-slate-800 hover:text-blue-600">
                      {issue.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{issue.projectName}</td>
                  <td className="px-4 py-3"><Badge type="priority">{issue.priority}</Badge></td>
                  <td className="px-4 py-3"><Badge type="issue">{issue.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
