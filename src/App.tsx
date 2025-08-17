import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError('');
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await getMovie(query);

      if ('Error' in result) {
        setError(result.Error);
        setPreviewMovie(null);
      } else {
        const movie: Movie = {
          title: result.Title,
          description: result.Plot,
          imgUrl:
            result.Poster && result.Poster !== 'N/A'
              ? result.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imdbId: result.imdbID,
        };

        setPreviewMovie(movie);
        setError('');
      }
    } catch {
      setError('Unexpected error');
      setPreviewMovie(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addMovie = () => {
    if (!previewMovie) {
      return;
    }

    setMovies(prev => {
      if (prev.some(item => item.imdbId === previewMovie?.imdbId)) {
        return prev;
      }

      return [...prev, previewMovie];
    });

    setQuery('');
    setPreviewMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          handleQuery={handleQuery}
          query={query}
          previewMovie={previewMovie}
          handleSearch={handleSearch}
          addMovie={addMovie}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};
