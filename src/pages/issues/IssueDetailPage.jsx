import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, MessageSquare, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "../../components/layout/AppLayout";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { Spinner } from "../../components/ui/Spinner";
import {
  getIssue,
  updateIssue,
  toggleFavorite,
  addSubIssue,
  toggleSubIssue,
  listActivity,
  addComment,
  addReply,
} from "../../api/issues.api";
import { getApiErrorMessage } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from "../../utils/constants";

function ActivityFeed({ issueId, entries, onRefresh }) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await addComment(issueId, comment.trim());
      setComment("");
      onRefresh();
      toast.success("Comment added");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(activityId) {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await addReply(issueId, activityId, replyText.trim());
      setReplyText("");
      setReplyingTo(null);
      onRefresh();
      toast.success("Reply added");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleComment} className="flex gap-2">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
        />
        <Button type="submit" variant="primary" size="sm" loading={submitting}>Post</Button>
      </form>

      {entries.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">No activity yet</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li key={entry._id} className="border-l-2 border-slate-200 pl-4">
              {entry.type === "action" && entry.action && (
                <div className="flex items-start gap-2">
                  <Avatar user={entry.action.createdBy} size="sm" />
                  <div>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">{entry.action.createdBy?.name}</span>{" "}
                      {entry.action.content}
                    </p>
                    <time className="text-xs text-slate-400">
                      {new Date(entry.createdAt).toLocaleString()}
                    </time>
                  </div>
                </div>
              )}
              {entry.type === "comment" && entry.comment && (
                <div>
                  <div className="flex items-start gap-2">
                    <Avatar user={entry.comment.createdBy} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{entry.comment.createdBy?.name}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{entry.comment.content}</p>
                      <time className="text-xs text-slate-400">
                        {new Date(entry.createdAt).toLocaleString()}
                      </time>
                      <button
                        type="button"
                        className="text-xs text-blue-600 mt-1"
                        onClick={() => setReplyingTo(entry._id)}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  {(entry.comment.replies || []).map((reply) => (
                    <div key={reply._id} className="ml-10 mt-2 flex items-start gap-2">
                      <Avatar user={reply.createdBy} size="sm" />
                      <div>
                        <p className="text-sm font-medium">{reply.createdBy?.name}</p>
                        <p className="text-sm text-slate-600">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                  {replyingTo === entry._id && (
                    <div className="ml-10 mt-2 flex gap-2">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        loading={submitting}
                        onClick={() => handleReply(entry._id)}
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function IssueDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSubIssue, setNewSubIssue] = useState("");

  function loadActivity() {
    listActivity(id)
      .then((res) => setActivity(res.data || []))
      .catch(() => {});
  }

  useEffect(() => {
    Promise.all([getIssue(id), listActivity(id)])
      .then(([iRes, aRes]) => {
        setIssue(iRes.data);
        setActivity(aRes.data || []);
      })
      .catch((err) => toast.error(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(status) {
    try {
      const res = await updateIssue(id, { status });
      setIssue(res.data);
      loadActivity();
      toast.success("Status updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function handlePriorityChange(priority) {
    try {
      const res = await updateIssue(id, { priority });
      setIssue(res.data);
      toast.success("Priority updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function handleToggleFavorite() {
    try {
      const res = await toggleFavorite(id);
      setIssue(res.data);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function handleAddSubIssue(e) {
    e.preventDefault();
    if (!newSubIssue.trim()) return;
    try {
      const res = await addSubIssue(id, newSubIssue.trim());
      setIssue(res.data);
      setNewSubIssue("");
      toast.success("Sub-issue added");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function handleToggleSub(subId) {
    try {
      const res = await toggleSubIssue(id, subId);
      setIssue(res.data);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  if (loading) {
    return (
      <AppLayout title="Issue">
        <Spinner className="py-20" />
      </AppLayout>
    );
  }

  if (!issue) {
    return (
      <AppLayout title="Issue not found">
        <p className="text-slate-500">This issue doesn&apos;t exist or you don&apos;t have access.</p>
      </AppLayout>
    );
  }

  const isFavorited = issue.favorite?.includes(user?._id);

  return (
    <AppLayout title={issue.title} subtitle={`${issue.key} · ${issue.projectName}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <button type="button" onClick={handleToggleFavorite} className="text-slate-400 hover:text-amber-500">
                <Star size={20} fill={isFavorited ? "currentColor" : "none"} className={isFavorited ? "text-amber-500" : ""} />
              </button>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">{issue.title}</h2>
                {issue.description && (
                  <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{issue.description}</p>
                )}
              </div>
            </div>
            {issue.file && (
              <a href={issue.file} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                View attachment
              </a>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Checklist</h3>
            <ul className="space-y-2 mb-3">
              {(issue.subIssues || []).map((sub) => (
                <li key={sub._id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleSub(sub._id)}
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      sub.done ? "bg-green-500 border-green-500 text-white" : "border-slate-300"
                    }`}
                  >
                    {sub.done && <Check size={12} />}
                  </button>
                  <span className={`text-sm ${sub.done ? "line-through text-slate-400" : "text-slate-700"}`}>
                    {sub.title}
                  </span>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddSubIssue} className="flex gap-2">
              <input
                value={newSubIssue}
                onChange={(e) => setNewSubIssue(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
              />
              <Button type="submit" variant="outline" size="sm"><Plus size={14} /></Button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare size={18} /> Activity
            </h3>
            <ActivityFeed issueId={id} entries={activity} onRefresh={loadActivity} />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Status</label>
              <select
                value={issue.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
              >
                {ISSUE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Priority</label>
              <select
                value={issue.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
              >
                {ISSUE_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Project</label>
              {issue.projectId ? (
                <Link to={`/projects/${issue.projectId}`} className="block text-sm text-blue-600 mt-1 hover:underline">
                  {issue.projectName}
                </Link>
              ) : (
                <p className="text-sm text-slate-500 mt-1">—</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Assignees</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(issue.assignees || []).length === 0 ? (
                  <p className="text-sm text-slate-400">Unassigned</p>
                ) : (
                  issue.assignees.map((a) => (
                    <div key={a._id} className="flex items-center gap-1.5">
                      <Avatar user={a} size="sm" />
                      <span className="text-sm">{a.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Badge type="issue">{issue.status}</Badge>
              <Badge type="priority">{issue.priority}</Badge>
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
