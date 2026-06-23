import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { forgotPassword } from "../../api/auth.api";
import { getApiErrorMessage } from "../../api/client";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const res = await forgotPassword(values.email);
      toast.success(res.message || "Check your email for reset instructions");
      setSent(true);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle={sent ? "If an account exists, you'll receive an email shortly." : "We'll send you a reset link"}
    >
      {!sent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Send reset link
          </Button>
        </form>
      ) : (
        <p className="text-sm text-slate-600 text-center">
          Check your inbox and follow the link to reset your password.
        </p>
      )}

      <p className="text-sm text-slate-500 text-center mt-6">
        <Link to="/login" className="text-blue-600 hover:text-blue-700">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
