import {
  FC,
  FormEvent,
  useMemo,
  useState,
  memo,
  ChangeEvent,
} from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  movies: Movie[];
  addMovie: (newMovie: Movie) => void
};

export const FindMovie: FC<Props> = memo(({ movies, addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isIncluded, setIsIncluded] = useState(false);

  // eslint-disable-next-line max-len
  const DEAFULT_PICTURE = useMemo(() => (
    'https://via.placeholder.com/360x270.png?text=no%20preview'
  ), []);

  const includedInList = movies.some(({ imdbId }) => (
    imdbId === movie?.imdbId
  ));

  const handleFind = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMovie(null);

    try {
      const responseFromServer = await getMovie(query);

      if ('imdbID' in responseFromServer) {
        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = responseFromServer;

        const newMovie = {
          title: Title,
          description: Plot,
          imgUrl: Poster !== 'N/A'
            ? Poster
            : DEAFULT_PICTURE,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovie(newMovie);
      } else {
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setQuery('');

    if (!includedInList && movie) {
      addMovie(movie);
    } else {
      setIsIncluded(true);
    }

    setMovie(null);
  };

  const handleInpute = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={handleInpute}
            />
          </div>
          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {isIncluded && (
            <p className="help is-danger" data-cy="errorMessage">
              The movie is already on the list
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn(
                'button',
                'is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={!query.length}
              onClick={handleFind}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
});
