import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<any[]>([]);

  const addMovieToList = (movie: Movie) => {
    setMovies(prevMovies => {
      // Проверяем, существует ли фильм в текущем списке по уникальному идентификатору
      const movieExists = prevMovies.some(m => m.imdbID === movie.imdbID);

      // Если фильм не найден, добавляем его в список
      if (!movieExists) {
        return [...prevMovies, movie];
      }

      // Если фильм уже есть в списке, не изменяем список
      return prevMovies;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovieToList={addMovieToList} />
      </div>
    </div>
  );
};
