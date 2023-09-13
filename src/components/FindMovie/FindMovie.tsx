import { useEffect, useMemo, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';

type FindMovieProps = {
  handleSetMovies: (e:Movie) => void
};

export const FindMovie: React.FC<FindMovieProps> = ({ handleSetMovies }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [formInput, setFormInput] = useState('');

  useEffect(() => {
    setIsLoading(false);
    setError(false);
    setMovie(null);
    if (!query) {
      return;
    }

    setIsLoading(true);
    getMovie(query)
      .then((result: MovieData | ResponseError) => {
        if (result) {
          const movieData = result as MovieData;

          setMovie({
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl: movieData.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : movieData.Poster,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          });
        }

        if ((result as ResponseError).Response === 'False') {
          setError(true);
          setMovie(null);
        }
      })
      .finally(() => setIsLoading(false));
  }, [query]);

  useMemo(() => {
    setError(false);
  }, [formInput]);

  const onAddClick = () => {
    handleSetMovies(movie as Movie);
    setQuery('');
    setMovie(null);
    setFormInput('');
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setQuery(formInput);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSubmit}
      >
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
              className={cn('input', {
                'is-danger': error,
              })}
              value={formInput}
              onChange={(e) => setFormInput(e.target.value)}
            />
          </div>
          {error && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={formInput.length === 0}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddClick}
              >
                Add to the list
              </button>
            )}

          </div>
        </div>
      </form>

      {error && <p>{error}</p>}
      {movie && <MovieCard movie={movie} />}

    </>
  );
};
