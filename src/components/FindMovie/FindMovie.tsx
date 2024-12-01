import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState<MovieData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFindMovieButton = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setLoadingData(true);
    setError(null);

    getMovie(movieTitle)
      .then(res => {
        if ('Title' in res) {
          const movieData = {
            Title: res.Title,
            Plot: res.Plot,
            Poster: res.Poster,
            imdbID: res.imdbID,
          };

          setData(movieData);
        } else {
          setError(res.Error);
          setData(null);
        }
      })
      .finally(() => setLoadingData(false));

    setMovieTitle('');
  };

  const newMovie = data && {
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster,
    imdbId: data.imdbID,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  };

  const handleAddMovie = () => {
    if (newMovie) {
      addMovie(newMovie);
      setData(null);
      setMovieTitle('');
      setError(null);
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
              className="input"
              value={movieTitle}
              onChange={event => {
                setMovieTitle(event.target.value);
                setError(null);
              }}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!movieTitle}
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': loadingData,
              })}
              onClick={handleFindMovieButton}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {data && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {data && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {newMovie && <MovieCard movie={newMovie} />}
        </div>
      )}
    </>
  );
};
