import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { ResponseError } from './types/ResponseError';
import { MovieData } from './types/MovieData';
import { getMovie } from './api';

const DEFAULT_IMAGE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [inputValue, setInputValue] = useState<string>(''); // for input box
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ResponseError | undefined>();
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!query) {
      setError(undefined);
      setLoading(false);
      setPreviewMovie(null);

      return;
    }

    setLoading(true);
    setError(undefined);

    getMovie(query)
      .then((result: MovieData | ResponseError) => {
        if ('Response' in result && result.Response === 'False') {
          setError(result);
          setPreviewMovie(null);

          return;
        }

        const movieData = result as MovieData;

        const movie: Movie = {
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl: movieData.Poster === 'N/A' ? DEFAULT_IMAGE : movieData.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        };

        setPreviewMovie(movie);
        setError(undefined);
      })
      .catch(() => {
        setError({ Response: 'False', Error: 'Unexpected error' });
        setPreviewMovie(null);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const handleAdd = useCallback(() => {
    if (!previewMovie) {
      return;
    }

    const alreadyAdded = movies.some(
      movie => movie.imdbId === previewMovie.imdbId,
    );

    if (alreadyAdded) {
      setInputValue('');
      setQuery('');
      setPreviewMovie(null);
      setError(undefined);

      return;
    }

    setMovies(prev => [...prev, previewMovie]);
    setInputValue('');
    setQuery('');
    setPreviewMovie(null);
    setError(undefined);
  }, [movies, previewMovie]);

  const handleTyping = useCallback(
    (newQuery: string) => {
      setInputValue(newQuery);

      if (error) {
        setError(undefined);
      }
    },
    [error],
  );

  const handleSearch = useCallback(() => {
    setQuery(inputValue.trim());
  }, [inputValue]);

  const memoizedMovies = useMemo(() => movies, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={memoizedMovies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={inputValue}
          onTyping={handleTyping}
          onSearch={handleSearch}
          loading={loading}
          error={error}
          onAdd={handleAdd}
          movie={previewMovie}
        />
      </div>
    </div>
  );
};
