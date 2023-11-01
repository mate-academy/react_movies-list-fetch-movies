import './App.scss';
import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const POSTER = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const App = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [receivedMovie, setReceivedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ResponseError | null>(null);

  const onSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if ('Poster' in data) {
          setReceivedMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster === 'N/A' ? POSTER : data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          });
        } else {
          setError(data);
        }
      })
      .finally(() => setLoading(false));
  };

  const onAddMovie = () => {
    if (!movies.some(movie => movie.imdbId === receivedMovie?.imdbId)) {
      setMovies([...movies, receivedMovie] as Movie[]);
    }

    setQuery('');
    setReceivedMovie(null);
  };

  const onChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          onChangeQuery={onChangeQuery}
          movie={receivedMovie}
          onAddMovie={onAddMovie}
          onSubmit={onSubmitForm}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
};
