import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  movies: Movie[],
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [movieToFind, setMovieToFind] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [movie]);

  const handleSubmitionForm = (event: React.FormEvent<HTMLFormElement>
  | React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (query === movieToFind) {
      return;
    }

    if (query) {
      setIsLoading(true);

      getMovie(query.toLowerCase().trim())
        .then((response) => {
          if ('Error' in response) {
            setIsError(true);

            return;
          }

          setMovieToFind(query);

          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        })
        // eslint-disable-next-line no-console
        .catch(() => console.warn('Server is not responding'))
        .finally(() => setIsLoading(false));
    }

    setMovieToFind(query);
  };

  const handleAddToTheList = () => {
    const findMovieIndex = movies
      .findIndex(movieItem => movieItem.imdbId === movie?.imdbId);

    if (findMovieIndex < 0 && movie) {
      setMovie(null);
      setMovieToFind('');
      setQuery('');
      setMovies([...movies, movie]);
    } else {
      setMovie(null);
      setMovieToFind('');
      setQuery('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => handleSubmitionForm(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              ref={inputRef}
              value={query}
              onKeyUp={(event) => (
                event.code === 'Enter' && handleSubmitionForm(event)
              )}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsError(false);
              }}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                { 'is-danger': isError },
              )}
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
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
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
                onClick={() => handleAddToTheList()}
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
