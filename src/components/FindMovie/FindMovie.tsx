import classnames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useState,
} from 'react';
import { getMovieFromServer } from '../../api/api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  movies: Movie[],
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorQuery, setErrorQuery] = useState('');

  const loadMovie = useCallback(async () => {
    const movieFromServer = await getMovieFromServer(query);

    if (movieFromServer.Response !== 'False') {
      setMovie(movieFromServer);
      setErrorQuery('');
    } else {
      setErrorQuery('Can not found movie!');
    }
  }, [query]);

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setErrorQuery('');
    },
    [],
  );

  const onAdd = useCallback(((event: FormEvent) => {
    event.preventDefault();

    if (!movie) {
      return;
    }

    if (movies.some(currMovie => currMovie.imdbID === movie.imdbID)) {
      setErrorQuery('This film is already on the list!');

      return;
    }

    addMovie(movie);
    setQuery('');
    setMovie(null);
  }), [movie, errorQuery]);

  const onFind = useCallback(() => {
    loadMovie();
  }, [query]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onAdd}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classnames('input', { 'is-danger': errorQuery })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {errorQuery && (
            <p className="help is-danger">
              {errorQuery}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onFind}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onAdd}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      { movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
