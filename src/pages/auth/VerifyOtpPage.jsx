import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../api/client";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyOtp } = useAuth();
  const [loading, setLoading] = useState(false);
  const defaultEmail = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: defaultEmail, otp: "" },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      await verifyOtp(values);
      toast.success("Account verified successfully");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit code we sent. It expires in 10 minutes."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Verification code"
          placeholder="123456"
          maxLength={6}
          error={errors.otp?.message}
          {...register("otp")}
        />

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Verify & continue
        </Button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-4">
        Didn&apos;t receive a code?{" "}
        <Link
          to={`/register${getValues("email") ? `?email=${encodeURIComponent(getValues("email"))}` : ""}`}
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Register again to resend
        </Link>
      </p>

      <p className="text-sm text-slate-500 text-center mt-4">
        <Link to="/login" className="text-blue-600 hover:text-blue-700">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
