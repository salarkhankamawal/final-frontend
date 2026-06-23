import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import AppLayout from "../../components/layout/AppLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { createProject } from "../../api/projects.api";
import { getApiErrorMessage } from "../../api/client";
import { PROJECT_STATUSES } from "../../utils/constants";

const schema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  status: z.enum(["Pending", "In Progress", "Completed"]),
});

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: "Pending", description: "" },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const res = await createProject(values);
      toast.success(res.message || "Project created");
      navigate(`/projects/${res.data._id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout title="New project" subtitle="Create a project for your team">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <Input label="Name" placeholder="My project" error={errors.name?.message} {...register("name")} />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="What is this project about?"
            {...register("description")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            {...register("status")}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" variant="primary" loading={loading}>Create project</Button>
        </div>
      </form>
    </AppLayout>
  );
}
