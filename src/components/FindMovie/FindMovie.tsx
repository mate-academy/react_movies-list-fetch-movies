import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

const HAS_NOT_FILE = 'N/A';

type Props = {
  onAddMovie: (m: Movie | null) => void,
};

export const FindMovie: React.FC<Props> = ({
  onAddMovie,
}) => {
  const [title, setTitle] = useState<string>('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [hasFindError, setHasFindError] = useState<boolean>(false);
  const [hasLoadingSubmit, setHasLoadingSubmit] = useState<boolean>(false);
  const [hasFirstLoad, setHasFirstLoad] = useState<boolean>(true);

  const createNewMovie = (movieDate: MovieData) => {
    const newDescrip = movieDate.Plot === HAS_NOT_FILE
      ? 'Unfortunately there is no description'
      : movieDate.Plot;
    const newposter = movieDate.Poster === HAS_NOT_FILE
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : movieDate.Poster;

    return {
      title: movieDate.Title,
      description: newDescrip,
      imgUrl: newposter,
      imdbId: movieDate.imdbID,
      imdbUrl: `https://www.imdb.com/title/${movieDate.imdbID}`,
    };
  };

  const handlerTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasFindError(false);
  };

  const handlerSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setHasLoadingSubmit(true);

    getMovie(title)
      .then(res => {
        if ('Response' in res && res.Response === 'False') {
          setHasFindError(true);
        } else {
          const newRes = res as MovieData;

          setSelectedMovie(createNewMovie(newRes));
          setHasFindError(false);
          setHasFirstLoad(false);
        }
      })
      .finally(() => {
        setHasLoadingSubmit(false);
      });
  };

  const handlerAddClick = () => {
    onAddMovie(selectedMovie);
    setHasFindError(false);
    setTitle('');
    setSelectedMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handlerSubmit}
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
              className={classNames('input', { 'is-danger': hasFindError })}
              value={title}
              onChange={handlerTitleChange}
            />
          </div>

          {hasFindError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!title}
              data-cy="searchButton"
              type="submit"
              className={classNames('button',
                { 'is-loading': hasLoadingSubmit },
                { 'is-light': !hasLoadingSubmit })}
            >
              {hasFirstLoad ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {selectedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handlerAddClick}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {selectedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={selectedMovie} />
        </div>
      )}
    </>
  );
};
