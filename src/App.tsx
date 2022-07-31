import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [moviesFavoriteList, setMoviesFavoriteList] = useState<Movie[]>([]);

  const addMovieToFavorites = (newMovie:Movie) => {
    setMoviesFavoriteList((current:Movie[]) => {
      if (current.some((element:Movie) => element.imdbId === newMovie.imdbId)) {
        return current;
      }

      const newFavoriteList = current.map((item:Movie) => ({ ...item }));

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
