import { FC, useEffect } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { getFeedsThunk } from '@slices';

import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { isLoading, feeds } = useSelector((state) => state.feed);

  const loadFeeds = () => dispatch(getFeedsThunk());

  useEffect(() => {
    loadFeeds();
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={feeds} handleGetFeeds={loadFeeds} />;
};
