import { useDispatch } from 'react-redux';
import { setLoggedIn, setUser, logout } from '../redux/feature/LoginSlice';
import { apiRoute } from '../utils/apiRoute';

export const useAuth = () => {
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    try {
      const response = await fetch(apiRoute.getUser, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          dispatch(setLoggedIn(true));
          dispatch(setUser(data.user));
          return data.user;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(apiRoute.logout, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=logout',
      });

      const data = await response.json();
      if (data.success) {
        dispatch(logout());
        return true;
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    return false;
  };

  return {
    fetchUserData,
    handleLogout,
  };
};
