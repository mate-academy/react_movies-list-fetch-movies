import { useState } from 'react';
import { getMovie } from './api';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import './App.scss';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSearch = () => {
    setLoading(true);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setMovie(null);
          setHasError(true);

          return;
        }

        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    setMovies(prevMovies => {
      const isDuplicate = prevMovies.some(item => item.imdbId === movie.imdbId);

      if (isDuplicate) {
        return prevMovies;
      }

      return [...prevMovies, movie];
    });

    setMovie(null);
    setQuery('');
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          movie={movie}
          loading={loading}
          hasError={hasError}
          onClearError={() => setHasError(false)}
          onAdd={handleAddMovie}
        />
      </div>
    </div>
  );
};
