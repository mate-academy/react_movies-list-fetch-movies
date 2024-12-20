import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchOk, setSearchOk] = useState(true);
  const [searchEmpty, setSearchEmpty] = useState(true);
  const [loading, setLoading] = useState(false);

  const addMovie = (newMovie: Movie) => {
    const isDuplicate = movies.some(mov => mov.imdbId === newMovie.imdbId);

    if (!isDuplicate) {
      setMovies(prevMovies => [...prevMovies, newMovie]);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={movie}
          query={query}
          movies={movies}
          setQuery={setQuery}
          onAdd={addMovie}
          searchOk={searchOk}
          setSearchOk={setSearchOk}
          searchEmpty={searchEmpty}
          setSearchEmpty={setSearchEmpty}
          loading={loading}
          setLoading={setLoading}
          setMovie={setMovie}
        />
      </div>
    </div>
  );
};
