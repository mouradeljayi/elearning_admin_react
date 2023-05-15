import { Navigate } from 'react-router-dom'
const PrivateRoutes = () => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
}

export default PrivateRoutes