import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [moviesFavoriteList, setMoviesFavoriteList] = useState<Movie[]>([]);

  const onAddMovieToFavorites = (newMovie: Movie) => {
    setMoviesFavoriteList((prevList: Movie[]) => {
      if (prevList.some(movie => movie.imdbId === newMovie.imdbId)) {
        return prevList;
      }

      const newFavoriteList = prevList
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
        <FindMovie onAddMovieToFavorites={onAddMovieToFavorites} />
      </div>
    </div>
  );
};
