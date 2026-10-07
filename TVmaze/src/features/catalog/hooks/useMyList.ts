import { useState } from 'react';
import type { TvmazeShow } from '../service';

const MY_LIST_KEY = 'tvmaze-my-list';

function readMyList(): TvmazeShow[] {
  try {
    const saved = localStorage.getItem(MY_LIST_KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed)
      ? parsed.filter(
          (show): show is TvmazeShow =>
            typeof show === 'object' &&
            show !== null &&
            'id' in show &&
            typeof show.id === 'number' &&
            'name' in show &&
            typeof show.name === 'string',
        )
      : [];
  } catch {
    return [];
  }
}

export function useMyList() {
  const [myList, setMyList] = useState<TvmazeShow[]>(readMyList);

  function isInMyList(show: TvmazeShow) {
    return myList.some((item) => item.id === show.id);
  }

  function toggleMyList(show: TvmazeShow) {
    const updated = isInMyList(show)
      ? myList.filter((item) => item.id !== show.id)
      : [...myList, { ...show, _embedded: undefined }];
    setMyList(updated);
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(updated));
  }

  return { myList, isInMyList, toggleMyList };
}
