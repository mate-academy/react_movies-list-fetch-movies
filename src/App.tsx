import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { normalizeMovieData } from './components/utils/normalize';
import { isResponseError } from './components/utils/typeGuards';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setError(null);
    const result = await getMovie(query);

    if (isResponseError(result)) {
      setError(result.Error || 'Movie not found');
      setPreviewMovie(null);
      return;
    }

    const movie = normalizeMovieData(result);

    if (!movie) {
      setError('Movie not found');
      setPreviewMovie(null);
      return;
    }

    setPreviewMovie(movie);
    setError(null);
  };

  const handleAddMovie = (movie: Movie) => {
    if (!movies.some(existingMovie => existingMovie.imdbId === movie.imdbId)) {
      setMovies([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onSearch={handleSearch}
          onAddMovie={handleAddMovie}
          previewMovie={previewMovie}
          setPreviewMovie={setPreviewMovie}
          error={error}
          setError={setError}
        />
        {error && <p data-cy="error-message" className="error-message">{error}</p>}
      </div>
    </div>
  );
};
