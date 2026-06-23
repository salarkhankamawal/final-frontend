import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import AppLayout from "../../components/layout/AppLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { createIssue } from "../../api/issues.api";
import { listProjects } from "../../api/projects.api";
import { getApiErrorMessage } from "../../api/client";
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from "../../utils/constants";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  projectId: z.string().min(1, "Project is required"),
  status: z.enum(["Open", "In Progress", "Resolved"]),
  priority: z.enum(["Low", "Medium", "High"]),
});

export default function IssueCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: searchParams.get("projectId") || "",
      status: "Open",
      priority: "Medium",
      description: "",
    },
  });

  useEffect(() => {
    listProjects()
      .then((res) => setProjects(res.data || []))
      .catch((err) => toast.error(getApiErrorMessage(err)));
  }, []);

  async function onSubmit(values) {
    setLoading(true);
    try {
      const res = await createIssue(values);
      toast.success(res.message || "Issue created");
      navigate(`/issues/${res.data._id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout title="New issue" subtitle="Create a work item">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <Input label="Title" placeholder="Fix login bug" error={errors.title?.message} {...register("title")} />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm min-h-[100px]"
            placeholder="Describe the issue..."
            {...register("description")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Project</label>
          <select
            className={`w-full px-3 py-2 rounded-lg border text-sm ${errors.projectId ? "border-red-400" : "border-slate-200"}`}
            {...register("projectId")}
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          {errors.projectId && <p className="mt-1 text-xs text-red-600">{errors.projectId.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" {...register("status")}>
              {ISSUE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" {...register("priority")}>
              {ISSUE_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" variant="primary" loading={loading}>Create issue</Button>
        </div>
      </form>
    </AppLayout>
  );
}
