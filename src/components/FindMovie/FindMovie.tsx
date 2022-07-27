import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoader, showLoader] = useState(false);
  const [hasMovie, takeMovie] = useState(false);
  const [noMovie, missMovie] = useState(false);
  const lowQuery = query.toLowerCase();

  const searchMovie = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    getMovie(lowQuery).then((movieData) => {
      if ('Error' in movieData) {
        missMovie(true);
        setQuery('');

        return;
      }

      setMovie({
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl: movieData.Poster,
        imdbUrl: movieData.Poster,
        imdbId: movieData.imdbID,
      });

      showLoader(true);
      takeMovie(true);
    }).finally(() => showLoader(false));
  };

  const addToList = () => {
    if (movie) {
      onAdd(movie);
    }

    setQuery('');
    takeMovie(false);
    missMovie(false);
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={searchMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            {' '}
            {movie?.title}
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {noMovie && (
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
              className={
                classNames('button', 'is-light', {
                   'is-loading': isLoader })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={addToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {(movie && hasMovie) && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
