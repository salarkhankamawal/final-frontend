import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { resetPassword } from "../../api/auth.api";
import { getApiErrorMessage } from "../../api/client";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const schema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  if (!token || !email) {
    return (
      <AuthLayout title="Invalid link" subtitle="This reset link is missing required parameters.">
        <p className="text-sm text-center">
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700">
            Request a new reset link
          </Link>
        </p>
      </AuthLayout>
    );
  }

  async function onSubmit(values) {
    setLoading(true);
    try {
      const res = await resetPassword({
        token,
        email,
        newPassword: values.newPassword,
      });
      toast.success(res.message || "Password reset successfully");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Reset password" subtitle={`Set a new password for ${email}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.newPassword ? "border-red-400" : "border-slate-200"
              }`}
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        <Input
          label="Confirm password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}
