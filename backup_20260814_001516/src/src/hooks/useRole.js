
import { useUser } from '../context/UserContext';

export default function useRole() {
  const { user } = useUser();
  return user?.role || 'guest';
}
