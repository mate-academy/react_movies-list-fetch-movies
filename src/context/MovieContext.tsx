import React, { createContext, useMemo, useState } from 'react';

import { Context } from '../types/MovieContext';
import { Movie } from '../types/Movie';
import { getMovie } from '../api';
import { MovieData } from '../types/MovieData';

export const MovieContext = createContext<Context>({
  movies: [],
  searchField: '',
  updateSearch: () => {},
  onSearchMovie: () => {},
  findMovie: null,
  findMovieError: false,
  findMovieLoading: false,
  onAddMovie: () => {},
  onResetData: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const MovieProvider: React.FC<Props> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [findMovie, setFindMovie] = useState<Movie | null>(null);
  const [findMovieLoading, setFindMovieLoading] = useState(false);
  const [findMovieError, setFindMovieError] = useState(false);
  const [searchField, setSearchField] = useState('');

  const updateSearch = (term: string) => {
    setFindMovieError(false);
    setSearchField(term);
  };

  const onSearchMovie = async (term: string) => {
    setFindMovieLoading(true);
    try {
      const responce = await getMovie(term);

      // eslint-disable-next-line no-prototype-builtins
      if (responce.hasOwnProperty('Error')) {
        setFindMovieError(true);
        setSearchField('');

        return;
      }

      const currentMovie = responce as MovieData;
      const defaultImg
        = 'https://via.placeholder.com/360x270.png?text=no%20preview';
      // eslint-disable-next-line max-len
      const imgUrl = currentMovie.Poster !== 'N/A' ? currentMovie.Poster : defaultImg;
      const imdbUrl = `https://www.imdb.com/title/${currentMovie.imdbID}`;

      setFindMovie({
        title: currentMovie.Title,
        description: currentMovie.Plot,
        imdbUrl,
        imgUrl,
        imdbId: currentMovie.imdbID,
      });
    } catch {
      setFindMovieError(true);
    } finally {
      setFindMovieLoading(false);
    }
  };

  const onResetData = () => {
    setSearchField('');
    setFindMovie(null);
  };

  const onAddMovie = (movie: Movie) => {
    setMovies((prev) => [...prev, movie]);
    onResetData();
  };

  const value = useMemo(
    () => ({
      movies,
      searchField,
      updateSearch,
      onSearchMovie,
      findMovieLoading,
      findMovieError,
      findMovie,
      onAddMovie,
      onResetData,
    }),
    [movies, searchField, findMovie, findMovieError, findMovieLoading],
  );

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
