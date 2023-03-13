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
  const [titleMovie, setTitleMovie] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isErrorSearch, setIsErrorSearch] = useState(false);
  const [errorMessage, setErrorMessage]
  = useState<ErrorMessage>(ErrorMessage.NONE);
  const [isSearching, setIsSearching] = useState(false);

  const resetForm = () => {
    setTitleMovie('');
  };

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setTitleMovie(event.target.value);
    setIsErrorSearch(false);
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
    setIsErrorSearch(true);
    setErrorMessage(error);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSearching(true);
    try {
      const movieData = await getMovie(titleMovie);

      if ('Error' in movieData) {
        showError(ErrorMessage.NO_MOVIE);

        return;
      }

      setNewMovie(getMovieFromData(movieData));
      setIsErrorSearch(false);
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
    setNewMovie(null);
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
              value={titleMovie}
              onChange={handleChange}
            />
          </div>
          {isErrorSearch && (
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
              disabled={!titleMovie}
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
