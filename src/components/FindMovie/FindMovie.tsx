/* eslint-disable no-console */
import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAddMovie: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({
  onAddMovie,
}) => {
  const [hasTitleError, setHasTitleError] = useState(false);
  const [queryWord, setQueryWord] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);

  const handleInputQuery = (inputQuery: string) => {
    setQueryWord(inputQuery);
  };

  const handleFindMovie = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoaded(true);
    const movieFromServer = await getMovie(queryWord);

    setIsLoaded(false);

    if ('Error' in movieFromServer) {
      setHasTitleError(true);

      return;
    }

    const {
      Poster,
      Title,
      Plot,
      imdbID,
    } = movieFromServer;

    setNewMovie({
      title: Title,
      description: Plot,
      imgUrl: Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFindMovie}
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
              value={queryWord}
              onChange={(event) => {
                handleInputQuery(event.target.value);
                setHasTitleError(false);
              }}
            />
          </div>

          {hasTitleError && (
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
              disabled={!queryWord}
              className={classNames(
                'button',
                'is-light',
                {
                  'is-loading': isLoaded === true,
                },
              )}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {newMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAddMovie(newMovie);
                  handleInputQuery('');
                  setNewMovie(null);
                  setHasTitleError(false);
                }}
              >
                Add to the list
              </button>
            )}
          </div>
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
