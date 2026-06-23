import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { activateAccount } from "../../api/auth.api";
import { getApiErrorMessage } from "../../api/client";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";

export default function ActivatePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid activation link.");
      return;
    }

    activateAccount(token, email)
      .then((res) => {
        setStatus("success");
        setMessage(res.message || "Account activated successfully");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(getApiErrorMessage(err));
      });
  }, [token, email]);

  return (
    <AuthLayout title="Account activation">
      <div className="flex flex-col items-center text-center py-4">
        {status === "loading" && <Spinner />}
        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
            <p className="text-sm text-slate-600 mb-6">{message}</p>
            <Link to="/login">
              <Button variant="primary">Go to login</Button>
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-sm text-slate-600 mb-6">{message}</p>
            <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm">
              Back to login
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
