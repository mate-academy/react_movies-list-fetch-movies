import {
  ChangeEvent, FC, FormEvent, memo, useCallback, useState,
} from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie, MovieData, ResponseError } from '../../types';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: FC<Props> = memo(({ onAddMovie }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      setShowError(false);
    }, [],
  );

  const handleSearch = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const searchedQuery = inputValue.trim().toLocaleLowerCase();

      setIsLoading(true);

      try {
        const response: MovieData | ResponseError
        = await getMovie(searchedQuery);

        if ('Title' in response) {
          const movie = response as MovieData;

          if (movie.Poster === 'N/A') {
            movie.Poster
            = 'https://via.placeholder.com/360x270.png?text=no%20preview';
          }

          setFoundMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl: movie.Poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
            imdbId: movie.imdbID,
          });
        } else {
          const error = response as ResponseError;

          throw new Error(error.Error);
        }
      } catch (error) {
        setShowError(true);
      } finally {
        setIsLoading(false);
        setInputValue('');
      }
    }, [inputValue],
  );

  const handleAddMovie = useCallback((movie: Movie) => {
    onAddMovie(movie);
    setFoundMovie(null);
  }, [onAddMovie]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSearch}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={inputValue}
              onChange={handleInputChange}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': showError,
              })}
            />
          </div>
          {
            showError && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!inputValue.trim().length}
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
            >
              Find a movie
            </button>
          </div>
          {
            foundMovie && (
              <div className="control">
                <button
                  onClick={() => handleAddMovie(foundMovie)}
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                >
                  Add to the list
                </button>
              </div>
            )
          }
        </div>
      </form>
      {
        foundMovie && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={foundMovie} />
          </div>
        )
      }
    </>
  );
});
