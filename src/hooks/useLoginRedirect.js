import { useNavigate, useLocation } from "react-router-dom";

export default function useLoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to manually trigger redirect
  const triggerRedirect = () => {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?redirect_to=${redirectTo}`);
  };

  return triggerRedirect; // Return the function to call when needed
}
