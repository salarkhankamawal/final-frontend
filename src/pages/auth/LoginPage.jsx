import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../Components/ui/Input";
import { Button } from "../../Components/ui/Button";
import { ApiErrorAlert } from "../../Components/shared/ApiErrorAlert";
import { MetaTags } from "../../Components/shared/MetaTags";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { login, getApiErrorMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("expired") === "1";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (sessionExpired) {
      toast.error("Your session has expired. Please sign in again.");
    }
  }, [sessionExpired]);

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Welcome back!");
      const from = location.state?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const message = getApiErrorMessage(err);
      if (status === 403) {
        setError("root", { message: "Your account is inactive. Contact support." });
      } else {
        setError("root", { message: status === 401 ? "Invalid email or password." : message });
      }
    }
  };

  return (
    <>
      <MetaTags title="Agent Login" description="Sign in to the SkyRoute travel agency admin portal." />
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Agent Login</h1>
        <p className="mt-1 text-sm text-slate-500">Access the booking management dashboard</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <ApiErrorAlert message={errors.root?.message} />
          <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New agent?{" "}
          <Link to="/register" className="font-medium text-sky-600 hover:text-sky-700">
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}
