import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAuth } from './AuthContext';

export const Spinner = ({ showAlways = false }) => {
  const { loading } = useAuth();

  if (!showAlways && !loading) return null;

  return (
    <div style={{ padding: 20 }}>
      <Skeleton height={40} width={300} />
      <Skeleton height={20} count={5} />
    </div>
  );
};
