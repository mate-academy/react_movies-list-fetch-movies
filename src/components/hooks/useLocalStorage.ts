import { useState } from 'react';
import { Movie } from '../../types/Movie';

export const useLocalStorage = (key: string, initialValue: []) => {
  const localData = localStorage.getItem(key);
  let localstore;

  if (localData === null) {
    localstore = initialValue;
  } else {
    localstore = JSON.parse(localData);
  }

  const [movies, setMovies] = useState<Movie[]>(localstore);

  const save = (movie: Movie) => {
    setMovies(prevstate => [...prevstate, movie]);
    localStorage.setItem(key, JSON.stringify([...movies, movie]));
  };

  return { allMovies: movies, setAllMovies: save };
};
