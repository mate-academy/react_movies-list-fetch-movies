import cn from 'classnames';
import React, { memo, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAddMovie: (movieId: Movie) => void;
  errorAddMovie: boolean;
  setErrorAddExist: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultPicture = (
  'https://via.placeholder.com/360x270.png?text=no%20preview'
);

export const FindMovie: React.FC<Props> = memo(
  ({ onAddMovie, errorAddMovie, setErrorAddExist }) => {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClickSumbit = () => {
      if (inputValue) {
        setIsLoading(true);

        getMovie(inputValue)
          .then(movie_API => {
            if ('Error' in movie_API) {
              setIsError(true);
            } else {
              setMovie({
                title: movie_API.Title,
                description: movie_API.Plot,
                imgUrl: movie_API.Poster !== 'N/A'
                  ? movie_API.Poster
                  : defaultPicture,
                imdbUrl: `https://www.imdb.com/title/${movie_API.imdbID}`,
                imdbId: movie_API.imdbID,
              });
            }
          })
          .finally(() => setIsLoading(false));
      }
    };

    const clear = () => {
      setMovie(null);
      setInputValue('');
    };

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);

      setIsError(false);
    };

    const handleSibmitForm = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      handleClickSumbit();
    };

    return (
      <>
        <form
          className="find-movie"
          onSubmit={handleSibmitForm}
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
                className="input is-dander"
                value={inputValue}
                onChange={(event => {
                  handleChangeInput(event);
                  setErrorAddExist(false);
                })}
              />
            </div>

            {(isError || errorAddMovie) && (
              <p className="help is-danger" data-cy="errorMessage">
                {errorAddMovie
                  ? 'the movie is already in your list'
                  : 'Can&apos;t find a movie with such a title'}
              </p>
            )}
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                data-cy="searchButton"
                type="submit"
                className={cn(
                  'button is-light',
                  { 'is-loading': isLoading },
                )}
                onClick={() => {
                  window.console.log(movie);
                }}
                disabled={!inputValue}

              >
                {!movie
                  ? 'Find a movie'
                  : 'Search again'}
              </button>
            </div>

            {movie && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={() => {
                    onAddMovie(movie);

                    clear();
                  }}
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
  },
);
