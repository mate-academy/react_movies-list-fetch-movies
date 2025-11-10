import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [submitedValue, setSubmitedValue] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onAdd = (movie: Movie) => {
    if (movies.find(curMovie => curMovie.imdbId === movie.imdbId)) {
      setSubmitedValue(null);
      setQuery('');

      return;
    }

    setMovies(prev => [...prev, movie]);
    setSubmitedValue(null);
    setQuery('');
  };

  const onFind = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setError(response.Error);
        } else {
          setSubmitedValue({
            title: response.Title,
            description: response.Plot,
            imgUrl:
              response.Poster && response.Poster !== 'N/A'
                ? response.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          movie={submitedValue}
          loading={loading}
          error={error}
          onError={setError}
          onQuery={setQuery}
          onSubmit={onFind}
          onAdd={onAdd}
        />
      </div>
    </div>
  );
};
