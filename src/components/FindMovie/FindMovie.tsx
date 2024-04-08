import React, {
  ChangeEventHandler,
  FormEventHandler,
  useMemo,
  useState,
} from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';

const DEAFULT_PICTURE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<MovieData | ResponseError | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const isError = useMemo(
    () => response && response.Response === 'False',
    [response],
  );

  const movie = useMemo(() => {
    if (!response || response.Response === 'False') {
      return null;
    }

    return {
      title: response.Title,
      description: response.Plot,
      imgUrl: response.Poster === 'N/A' ? DEAFULT_PICTURE : response.Poster,
      imdbId: response.imdbID,
      imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
    };
  }, [response]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = e => {
    setQuery(e.target.value);
    setResponse(null);
  };

  const handleFormSubbmit: FormEventHandler = e => {
    e.preventDefault();
    const searchQuery = query
      .trim()
      .toLowerCase()
      .replace(/\s+/g, () => '+');

    setIsLoading(true);
    getMovie(searchQuery).then(data => {
      setIsLoading(false);
      setResponse(data);
    });
  };

  const handleAddMovie = () => {
    if (movie) {
      onAdd(movie);
      setQuery('');
      setResponse(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubbmit}>
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
              className={classNames('input', { 'is-danger': isError })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query.trim()}
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
                onClick={handleAddMovie}
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
};
