import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  // функція, яка буде робити задачу onAdd з компонента FindMovies
  const handleAddMovie = (newMovie: Movie) => {
    /* перевірка на те, чи в масиві уже є фільм
    з таким ІД, some повертає true якщо хоч одна перевірка
    співпадає */
    const alreadyExists = movies.some(
      movie => movie.imdbId === newMovie.imdbId,
    );

    if (alreadyExists) {
      return;
    }

    /* в сеттер можна прийняти колбек, параметром якого був попередній
    стан змінної movies, до попереднього стану додаєм новий фільм */
    setMovies(currMovies => [...currMovies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleAddMovie} />
      </div>
    </div>
  );
};
