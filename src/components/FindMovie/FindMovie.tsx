import {
  FC,
  useState,
  useCallback,
  ChangeEvent,
  FormEvent,
} from 'react';
import { getMovies } from '../../api/api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [queryError, setQueryError] = useState('');
  const [isError, setIsError] = useState(false);

  const handleQuery = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setQueryError('');
    setIsError(false);
  }, []);

  const handleSearch = useCallback(() => {
    if (!query.trim()) {
      setQueryError('Enter the title!');
      setIsError(true);
    } else {
      const getData = async () => {
        const response = await getMovies(query);

        if (response.Response !== 'False') {
          setMovie(response);
          setQueryError('');
          setIsError(false);
        } else {
          setQueryError('Can not find a movie with this title');
          setIsError(true);
        }
      };

      getData();
    }
  }, [query]);

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!movie) {
      setQueryError('Input your search request for the first');
      setIsError(true);
    }

    if (!queryError && movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  }, [movie, isError]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={`input ${isError ? 'is-danger' : ''}`}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {isError && (
            <p className="help is-danger">
              {queryError}
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            movie={movie}
          />
        </div>
      )}

    </>
  );
};
