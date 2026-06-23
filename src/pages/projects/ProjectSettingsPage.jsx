import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AppLayout from "../../components/layout/AppLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { Spinner } from "../../components/ui/Spinner";
import {
  getProject,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
} from "../../api/projects.api";
import { getApiErrorMessage } from "../../api/client";
import { PROJECT_STATUSES } from "../../utils/constants";

export default function ProjectSettingsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getProject(id)
      .then((res) => {
        setProject(res.data);
        reset({
          name: res.data.name,
          description: res.data.description,
          status: res.data.status,
        });
      })
      .catch((err) => toast.error(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, reset]);

  async function onSave(values) {
    setSaving(true);
    try {
      const res = await updateProject(id, values);
      setProject(res.data);
      toast.success(res.message || "Project updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this project and all its issues? This cannot be undone.")) return;
    try {
      await deleteProject(id);
      toast.success("Project deleted");
      navigate("/projects");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function handleAddMember(e) {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    setAddingMember(true);
    try {
      const res = await addTeamMember(id, { email: memberEmail.trim() });
      setProject(res.data);
      setMemberEmail("");
      toast.success(res.message || "Member added");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setAddingMember(false);
    }
  }

  async function handleRemoveMember(userId) {
    try {
      const res = await removeTeamMember(id, userId);
      setProject(res.data);
      toast.success(res.message || "Member removed");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  if (loading) {
    return (
      <AppLayout title="Project settings">
        <Spinner className="py-20" />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Project settings" subtitle={project?.name}>
      <div className="max-w-2xl space-y-6">
        <form
          onSubmit={handleSubmit(onSave)}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
        >
          <h2 className="font-semibold text-slate-900">General</h2>
          <Input label="Name" {...register("name")} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm min-h-[80px]"
              {...register("description")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" {...register("status")}>
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="primary" loading={saving}>Save changes</Button>
        </form>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Team members</h2>
          <form onSubmit={handleAddMember} className="flex gap-2 mb-4">
            <input
              type="email"
              placeholder="Add by email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
            <Button type="submit" variant="primary" loading={addingMember}>Add</Button>
          </form>
          <ul className="space-y-2">
            {(project?.team || []).map((member) => (
              <li key={member._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <Avatar user={member} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member._id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-red-200 rounded-xl p-6">
          <h2 className="font-semibold text-red-700 mb-2">Danger zone</h2>
          <p className="text-sm text-slate-500 mb-4">Permanently delete this project and all issues.</p>
          <Button type="button" variant="danger" onClick={handleDelete}>Delete project</Button>
        </div>
      </div>
    </AppLayout>
  );
}
