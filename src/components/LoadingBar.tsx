import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import NProgress from 'nprogress';
import { RootState } from '../store';
import 'nprogress/nprogress.css';

export const LoadingBar: React.FC = () => {
  const loading = useSelector((state: RootState) => state.anime.loading);

  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [loading]);

  return null;
};