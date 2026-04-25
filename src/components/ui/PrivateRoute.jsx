import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <span className="text-slate-400 text-sm">Carregando...</span>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
