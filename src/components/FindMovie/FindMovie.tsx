import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

interface Props {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [queryTitle, setQueryTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movieFoundError, setMovieFoundError] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isFindingAgain, setIsFindingAgain] = useState(false);
  const [movieWasAskedOnce, setMovieWasAskedOnce] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieFoundError(false);
    setQueryTitle(event.target.value);
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleAddMovieToList = () => {
    const copyOfMovies: Movie[] = [...movies];
    const movieAlreadyInList = copyOfMovies.find(movie => {
      const { imdbId } = newMovie as Movie;

      return movie.imdbId === imdbId;
    });

    if (!movieAlreadyInList) {
      setMovies([...copyOfMovies, newMovie as Movie]);
    }

    setNewMovie(null);
    setQueryTitle('');
  };

  const loadMovie = () => {
    setIsLoading(true);

    getMovie(queryTitle.trim())
      .catch(() => setMovieFoundError(true))
      .then(movieFromServer => {
        const { Response } = movieFromServer as ResponseError;

        if (Response !== 'False') {
          const {
            Title, Poster, Plot, imdbID,
          } = movieFromServer as MovieData;

          const newMovieFromServer: Movie = {
            title: Title,
            imgUrl: Poster,
            description: Plot,
            imdbId: imdbID,
            imdbUrl: imdbID,
          };

          setNewMovie(newMovieFromServer);
        } else {
          setMovieFoundError(true);
          setIsFindingAgain(false);
          setNewMovie(null);
        }

        setIsLoading(false);
        setMovieWasAskedOnce(true);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleOnSubmit}
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
              className={classNames(
                'input',
                {
                  'is-danger': movieFoundError,
                },
              )}
              value={queryTitle}
              onChange={handleInputChange}
            />
          </div>

          {movieFoundError && (
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
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={queryTitle.trim().length === 0}
              onClick={() => loadMovie()}
            >
              {movieWasAskedOnce ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {newMovie !== null && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovieToList}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {newMovie !== null && !movieFoundError && !isFindingAgain && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
