import React, { useState } from 'react';
import './FindMovie.scss';

import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

const IMDB_URL_MOVIE = 'https://www.imdb.com/title/';
const DEFAULT_IMG = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  addMovie: (m: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [searchingMovie, setSearchingMovie] = useState(false);

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(event.currentTarget.value);
    setIsNotFound(false);
  };

  function sendForm(event: React.FormEvent) {
    const normalizeSearchValue = searchTitle.toLocaleLowerCase();

    event.preventDefault();
    setSearchingMovie(true);

    getMovie(normalizeSearchValue)
      .then(res => {
        if ('Error' in res) {
          setIsNotFound(true);
        } else {
          const img = res.Poster === 'N/A' ? DEFAULT_IMG : res.Poster;

          const newMovieObj: Movie = {
            title: res.Title,
            description: res.Plot,
            imgUrl: img,
            imdbUrl: IMDB_URL_MOVIE + res.imdbID,
            imdbId: res.imdbID,
          };

          setNewMovie(newMovieObj);
        }
      })
      .finally(() => setSearchingMovie(false));
  }

  function onClickAddMovie() {
    if (newMovie) {
      addMovie(newMovie);
      setSearchTitle('');
      setIsNotFound(false);
      setNewMovie(null);
      setSearchingMovie(false);
    }
  }

  return (
    <>
      <form className="find-movie" onSubmit={sendForm}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={searchTitle}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': isNotFound })}
              onChange={onChangeInput}
            />
          </div>
          {isNotFound && (
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
                'is-loading': searchingMovie,
              })}
              disabled={!searchTitle}
            >
              {newMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onClickAddMovie}
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
