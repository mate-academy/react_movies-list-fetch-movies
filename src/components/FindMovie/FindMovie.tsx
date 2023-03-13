import React, { useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ErrorMessage } from '../../types/ErrorMessage';
import './FindMovie.scss';

type Props = {
  onAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage]
  = useState<ErrorMessage>(ErrorMessage.NONE);
  const [isSearching, setIsSearching] = useState(false);

  const resetForm = () => {
    setQuery('');
    setNewMovie(null);
  };

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage(ErrorMessage.NONE);
  };

  const getMovieFromData = ({
    Poster,
    Title,
    Plot,
    imdbID,
  }: MovieData): Movie => ({
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : Poster,
    imdbId: imdbID,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
  });

  const showError = (error: ErrorMessage) => {
    setErrorMessage(error);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSearching(true);
    try {
      const movieData = await getMovie(query);

      if ('Error' in movieData) {
        showError(ErrorMessage.NO_MOVIE);

        return;
      }

      setNewMovie(getMovieFromData(movieData));
      showError(ErrorMessage.NONE);
    } catch {
      showError(ErrorMessage.UNEXPECTED);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = () => {
    if (!newMovie) {
      return;
    }

    onAdd(newMovie);
    resetForm();
    showError(ErrorMessage.NONE);
  };

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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={handleChange}
            />
          </div>
          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button is-light"',
                { 'is-loading': isSearching },
              )}
              disabled={!query}
            >
              {!newMovie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
