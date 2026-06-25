import { Link, Outlet } from "react-router-dom";
import { Plane } from "lucide-react";
import whitelogo from "../../assets/logowhite.png";

export default function AuthLayout() {
  return (
    <div className="min-h-screen  flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900">
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-white font-bold">
          <img className="" src={whitelogo} alt="Nawi Saadi Travel Agency" />
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
