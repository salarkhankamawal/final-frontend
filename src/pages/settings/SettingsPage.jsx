import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { NavLink, Outlet } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile, changePassword } from "../../api/auth.api";
import { getApiErrorMessage } from "../../api/client";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  avatar: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function SettingsNav() {
  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-lg text-sm font-medium ${
      isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <nav className="space-y-1 w-48 shrink-0">
      <NavLink to="/settings/profile" className={linkClass}>
        Profile
      </NavLink>
      <NavLink to="/settings/security" className={linkClass}>
        Security
      </NavLink>
    </nav>
  );
}

export function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", avatar: user?.avatar || "" },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const payload = { name: values.name };
      if (values.avatar) payload.avatar = values.avatar;
      const res = await updateProfile(payload);
      updateUser(res.data);
      toast.success(res.message || "Profile updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <Input label="Name" error={errors.name?.message} {...register("name")} />
      <Input
        label="Avatar URL"
        placeholder="https://..."
        error={errors.avatar?.message}
        {...register("avatar")}
      />
      <Button type="submit" variant="primary" loading={loading}>
        Save changes
      </Button>
    </form>
  );
}

export function SecuritySettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  if (user?.authProvider === "google") {
    return (
      <p className="text-sm text-slate-600">
        You signed in with Google. Password change is not available for Google-only accounts.
      </p>
    );
  }

  async function onSubmit(values) {
    setLoading(true);
    try {
      const res = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success(res.message || "Password changed");
      reset();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <Input
        label="Current password"
        type="password"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />
      <Input
        label="New password"
        type="password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <Input
        label="Confirm new password"
        type="password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" variant="primary" loading={loading}>
        Change password
      </Button>
    </form>
  );
}

export default function SettingsLayout() {
  return (
    <AppLayout title="Settings" subtitle="Manage your account">
      <div className="flex flex-col md:flex-row gap-8">
        <SettingsNav />
        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6">
          <Outlet />
        </div>
      </div>
    </AppLayout>
  );
}
