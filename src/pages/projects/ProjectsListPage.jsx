import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "../../components/layout/AppLayout";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { listProjects } from "../../api/projects.api";
import { getApiErrorMessage } from "../../api/client";
import { PROJECT_STATUSES } from "../../utils/constants";

export default function ProjectsListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    listProjects()
      .then((res) => setProjects(res.data || []))
      .catch((err) => toast.error(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [projects, statusFilter, query]);

  return (
    <AppLayout title="Projects" subtitle="Manage your team projects">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 bg-white border border-slate-200 rounded-lg px-3 h-10">
          <Search size={16} className="text-slate-400" />
          <input
            className="flex-1 text-sm outline-none bg-transparent"
            placeholder="Search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="h-10 border border-slate-200 rounded-lg px-3 text-sm bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <Link to="/projects/new">
          <Button variant="primary">
            <Plus size={16} /> New project
          </Button>
        </Link>
      </div>

      {loading ? (
        <Spinner className="py-20" />
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-slate-500 mb-4">No projects found</p>
          <Link to="/projects/new">
            <Button variant="primary">Create your first project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="w-3 h-3 rounded-full mt-1"
                  style={{ backgroundColor: project.color }}
                />
                <Badge type="project">{project.status}</Badge>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{project.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{project.team?.length || 0} members</span>
                <span>{project.issueCount || 0} issues</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
