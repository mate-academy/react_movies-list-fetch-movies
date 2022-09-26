import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMove: (mov: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMove }) => {
  const [searchInput, setSearchInput] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [disabledButton, setDisabledButton] = useState(true);
  const [load, setLoad] = useState(true);
  // eslint-disable-next-line max-len
  const defaultImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const fetchMovie = async () => {
    const newMovie = await getMovie(searchInput);

    if (newMovie.Response === 'False') {
      setErrorMessage(true);
      setMovie(null);
      setLoad(true);
    } else {
      setErrorMessage(false);
      setLoad(true);

      setMovie({
        title: newMovie.Title,
        description: newMovie.Plot,
        imgUrl: newMovie.Poster === 'N/A' ? defaultImg : newMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
        imdbId: newMovie.imdbID,
      });
    }
  };

  const resetSets = () => {
    setMovie(null);
    setDisabledButton(true);
    setSearchInput('');
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!searchInput) {
      return;
    }

    setLoad(false);
    fetchMovie();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setDisabledButton(e.target.value === '');
                setErrorMessage(false);
              }}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}

        </div>

        <div className="field is-grouped is-loading">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light',
                load ? '' : 'is-loading')}
              disabled={disabledButton}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie !== null && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMove(movie);
                  resetSets();
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>
      {movie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
