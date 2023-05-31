import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  value: string,
  movies: Movie[],
  setValue: (query: string) => void,
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({
  value,
  movies,
  setValue,
  setMovies,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const getImgUrl = (url: string) => {
    return url === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : url;
  };

  const handleSearchMovie = async () => {
    setIsLoading(true);
    await getMovie(value)
      .then((response) => {
        if ('imdbID' in response) {
          const newMovie: Movie = {
            title: response.Title,
            description: response.Plot,
            imgUrl: getImgUrl(response.Poster),
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          };

          setMovie(newMovie);
        } else {
          setNotFound(true);
          setMovie(null);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setNotFound(false);
    setValue(event.target.value);
  };

  const handleAddMovie = (currentMovie: Movie) => {
    let isIncluded = false;

    movies.forEach(item => {
      if (item.imdbId === currentMovie.imdbId) {
        isIncluded = true;
      }
    });

    if (!isIncluded) {
      setMovies(currentMovies => [...currentMovies, currentMovie]);
    }

    setMovie(null);
    setValue('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              className={classNames('input', {
                'is-danger': notFound,
              })}
              value={value}
              onChange={handleChangeQuery}
            />
          </div>

          {notFound && (
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={handleSearchMovie}
              disabled={!value}
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
                onClick={() => movie && handleAddMovie(movie)}
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
