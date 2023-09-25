import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: (value: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({
  movies,
  setMovies,
}) => {
  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleFindChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsError(false);
  };

  const handleFindClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    setLoading(true);

    getMovie(title)
      .then((response) => {
        if ('Error' in response && response.Error === 'Movie not found!') {
          setIsError(true);
        }

        if ('Title' in response) {
          const allowedKeys = ['Poster', 'Title', 'Plot', 'imdbID'];

          const movieDataNormalized = Object.fromEntries(
            Object
              .entries(response)
              .filter(([key]) => allowedKeys.includes(key)),
          );

          if (movieDataNormalized.Poster
            && movieDataNormalized.Poster.length < 5) {
            movieDataNormalized.Poster = (
              'https://via.placeholder.com/360x270.png?text=no%20preview'
            );
          }

          setMovie({
            title: movieDataNormalized.Title,
            description: movieDataNormalized.Plot,
            imgUrl: movieDataNormalized.Poster,
            imdbUrl: `https://www.imdb.com/title/${movieDataNormalized.imdbID}`,
            imdbId: movieDataNormalized.imdbID,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAddClick = () => {
    setIsError(false);

    if (movie) {
      const isMovieAdded = movies.some(item => item.imdbId === movie.imdbId);

      if (!isMovieAdded) {
        setMovies([...movies, movie]);
      }

      setTitle('');
      setMovie(null);
    }
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
              className="input is-danger"
              value={title}
              onChange={handleFindChange}
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
              className={classNames('button', {
                'is-light': !loading,
                'is-loading': loading,
              })}
              disabled={!title}
              onClick={handleFindClick}
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
                onClick={handleAddClick}
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
