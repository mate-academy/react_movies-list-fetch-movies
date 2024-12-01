import React, { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';

type FindMovieProps = {
  setMovies: Dispatch<SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<FindMovieProps> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [isAddButtonShown, setIsAddButtonShown] = useState(false);

  const handleQuery = (value: string) => {
    setQuery(value);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await getMovie(query);

      setMovie(result as MovieData);
      setIsAddButtonShown(true);
    } catch (error) {
      setErrorMessage("Can't find a movie with such a title");
      setIsAddButtonShown(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (movie) {
      setMovies(prevMovies => [...prevMovies, movie]);
      setQuery('');
      setErrorMessage('');
      setMovie(null);
      setIsAddButtonShown(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={e => handleQuery(e.target.value)}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {errorMessage}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query.trim()}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
            >
              Find a movie
            </button>
          </div>
          {isAddButtonShown && (
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
