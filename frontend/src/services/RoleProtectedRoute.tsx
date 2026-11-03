import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Spinner from "../components/Spinner/Spinner";
import type { User } from "../interfaces/User";
import api from "./api";

export default function RoleProtectedRoute({ children }: { children: ReactNode }) {
    const [allowed, setAllowed] = useState<boolean | null>(null);
    useEffect(() => {
        let active = true;
        api.get<User>("users/me/")
            .then(({ data }) => { if (active) setAllowed(Boolean(data.is_staff || data.is_superuser)); })
            .catch(() => { if (active) setAllowed(false); });
        return () => { active = false; };
    }, []);
    if (allowed === null) return <Spinner />;
    return allowed ? <>{children}</> : <Navigate to="/infinix/" replace />;
}
