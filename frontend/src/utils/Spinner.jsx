import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAuth } from './AuthContext';
export const Spinner =()=>{
    const {loading} = useAuth()
    if (loading) {
      return (
        <div style={{ padding: 20 }}>
          <Skeleton height={40} width={300} />
          <Skeleton height={20} count={5} />
        </div>
      );
    }
}
