import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Settings, Plus } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "../../components/layout/AppLayout";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { Spinner } from "../../components/ui/Spinner";
import { getProject } from "../../api/projects.api";
import { listIssues } from "../../api/issues.api";
import { getApiErrorMessage } from "../../api/client";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProject(id), listIssues({ projectId: id })])
      .then(([pRes, iRes]) => {
        setProject(pRes.data);
        setIssues(iRes.data || []);
      })
      .catch((err) => toast.error(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AppLayout title="Project">
        <Spinner className="py-20" />
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout title="Project not found">
        <p className="text-slate-500">This project doesn&apos;t exist or you don&apos;t have access.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={project.name}
      subtitle={project.description || "No description"}
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Badge type="project">{project.status}</Badge>
        <span className="text-sm text-slate-500">
          {project.issueCount} issues · {project.resolvedCount} resolved
        </span>
        <Link to={`/projects/${id}/settings`} className="ml-auto">
          <Button variant="outline" size="sm">
            <Settings size={14} /> Settings
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Issues</h2>
            <Link to={`/issues/new?projectId=${id}`}>
              <Button variant="primary" size="sm">
                <Plus size={14} /> New issue
              </Button>
            </Link>
          </div>
          {issues.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No issues in this project yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {issues.map((issue) => (
                <li key={issue._id}>
                  <Link
                    to={`/issues/${issue._id}`}
                    className="flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <span className="text-xs font-mono text-slate-400">{issue.key}</span>
                      <p className="text-sm font-medium text-slate-800">{issue.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge type="priority">{issue.priority}</Badge>
                      <Badge type="issue">{issue.status}</Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Team</h2>
          <ul className="space-y-3">
            {(project.team || []).map((member) => (
              <li key={member._id} className="flex items-center gap-3">
                <Avatar user={member} size="sm" />
                <div>
                  <p className="text-sm font-medium text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
