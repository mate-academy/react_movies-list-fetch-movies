import { useCallback, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';

function movieFromData(data: MovieData): Movie {
  return {
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
}

type Props = {
  onAddToList: (movie: Movie) => void;
};

export const FindMovie = ({ onAddToList }: Props) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isSearchError, setIsSearchError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToList = useCallback(() => {
    onAddToList(movie as Movie);

    setQuery('');
    setMovie(null);
  }, [movie, onAddToList]);

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsSearchError(false);
      setQuery(event.target.value);
    },
    [],
  );

  const handleSearch = useCallback(() => {
    setIsLoading(true);

    getMovie(query)
      .then(response => {
        if ((response as ResponseError).Response === 'False') {
          setIsSearchError(true);

          return;
        }

        setMovie(movieFromData(response as MovieData));
      })
      .finally(() => setIsLoading(false));
  }, [query]);

  const handleSearchWithEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') {
        return;
      }

      event.preventDefault();
      handleSearch();
    },
    [handleSearch],
  );

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleSearchWithEnter}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { ' is-danger': isSearchError })}
            />
          </div>

          {isSearchError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={handleSearch}
              data-cy="searchButton"
              type="button"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                onClick={handleAddToList}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">{movie.title}</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
