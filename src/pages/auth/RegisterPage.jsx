import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../Components/ui/Input";
import { Button } from "../../Components/ui/Button";
import { ApiErrorAlert } from "../../Components/shared/ApiErrorAlert";
import { MetaTags } from "../../Components/shared/MetaTags";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agencyName: z.string().min(1, "Agency name is required"),
  role: z.string().optional(),
});

export default function RegisterPage() {
  const { register: registerAgent, getApiErrorMessage } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await registerAgent(data);
      toast.success("Account created successfully!");
      navigate("/admin", { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const message = getApiErrorMessage(err);
      if (status === 409) {
        setError("email", { message: "An account with this email already exists." });
      } else {
        setError("root", { message });
      }
    }
  };

  return (
    <>
      <MetaTags title="Agent Register" description="Register as a travel agent on Nawi Saadi." />
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Create Agent Account</h1>
        <p className="mt-1 text-sm text-slate-500">Join the Nawi Saadi booking platform</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <ApiErrorAlert message={errors.root?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="First name" error={errors.firstName?.message} {...register("firstName")} />
            <Input label="Last name" error={errors.lastName?.message} {...register("lastName")} />
          </div>
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input label="Phone" type="tel" error={errors.phone?.message} {...register("phone")} />
          <Input label="Agency name" error={errors.agencyName?.message} {...register("agencyName")} />
          <Input
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-sky-600 hover:text-sky-700">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
