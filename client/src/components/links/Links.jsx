import React, { useEffect, useState, useCallback } from 'react'
import './links.css'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLinkStore } from '../../store/useLinkStore'
import Loader from '../loader/Loader';
import { resolveAvatar } from '../../utilities/defaultImages';
import { useAuthStore } from '../../store/useAuthStore';

export default function Links() {
  const { links, fetchLinks } = useLinkStore();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchLinks(1, LIMIT, true).then((res) => {
      if (res) setHasMore(res.hasMore);
    });
    // eslint-disable-next-line
  }, []);

  const fetchMoreLinks = useCallback(() => {
    setPage(prevPage => {
      const nextPage = prevPage + 1;
      fetchLinks(nextPage, LIMIT).then((res) => {
        if (res) setHasMore(res.hasMore);
      });
      return nextPage;
    });
  }, [fetchLinks]);


  return (
      <InfiniteScroll
        dataLength={links.length}
        next={fetchMoreLinks}
        hasMore={hasMore}
        loader={<Loader size={20}/>} 
        endMessage={<p className="links-end-message">No more links</p>}
      >
        <ul className="links-list">
          {links.map(link => {
            const linkUser = (!link.user1) ? link.user2 : link.user1;
            return (
              <li key={link._id} className="links-list-item">
                <div className="link-user-info">
                  <img
                    src={resolveAvatar(linkUser)}
                    alt={linkUser?.name || 'User'}
                    className="link-user-avatar"
                  />
                  <div className="link-user-details">
                    <span className="link-user-name">{linkUser?.name}</span>
                    <span className="link-user-email">{linkUser?.email}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </InfiniteScroll>
  )
}
