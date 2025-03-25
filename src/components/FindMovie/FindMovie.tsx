import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
interface Props {
  setNewMovie: (movie: Movie) => void;
}
const defaultImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ setNewMovie }) => {
  const [inputQuery, setInputQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [findError, setFindError] = useState(false);

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(inputQuery)
      .then(movieFromServer => {
        if ('Error' in movieFromServer) {
          setMovie(null);
          setFindError(true);

          return;
        }

        const { Title, Plot, imdbID, Poster } = movieFromServer;
        const newMovie = {
          title: Title,
          description: Plot,
          imgUrl: Poster.includes('N/A') ? defaultImg : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setFindError(false);
        setMovie(newMovie);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovie = (newMovie: Movie) => {
    setNewMovie(newMovie);
    setMovie(null);
    setInputQuery('');
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(event.target.value);
    setFindError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleOnSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              value={inputQuery}
              onChange={handleOnChange}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': findError,
              })}
            />
          </div>

          {findError && (
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
              disabled={!inputQuery.trim()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                onClick={() => handleAddMovie(movie)}
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            )}
          </div>
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
