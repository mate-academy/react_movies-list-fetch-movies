import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [moviesFavoriteList, setMoviesFavoriteList] = useState<Movie[]>([]);

  const addMovieToFavorites = (newMovie:Movie) => {
    setMoviesFavoriteList((previousMoviesFavoriteList:Movie[]) => {
      if (previousMoviesFavoriteList.some(
        (movie:Movie) => movie.imdbId === newMovie.imdbId,
      )) {
        return previousMoviesFavoriteList;
      }

      const newFavoriteList = previousMoviesFavoriteList
        .map((movie:Movie) => ({ ...movie }));

      newFavoriteList.push({ ...newMovie });

      return newFavoriteList;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={moviesFavoriteList} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovieToFavorites={addMovieToFavorites}
        />
      </div>
    </div>
  );
};
