import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AuthRedirector = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && profile) {
      let redirectPath = "/";

      switch (profile.role) {
        case "consumer":
          redirectPath = "/consumer-dashboard";
          break;
        case "business_partner":
          redirectPath = "/business-partner-dashboard";
          break;
        case "service_center":
          redirectPath = "/service-center-dashboard";
          break;
        default:
          redirectPath = "/";
          break;
      }

      if (location.pathname === "/auth") {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, profile, loading, navigate, location.pathname]);

  return null; // This component doesn't render anything visible
};

export default AuthRedirector;
