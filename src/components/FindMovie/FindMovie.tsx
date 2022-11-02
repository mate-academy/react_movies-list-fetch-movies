import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  onAddMovie: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function findMovie() {
    setHasLoadingError(false);
    setLoading(true);
    const newMovie = await getMovie(query);

    if ('Error' in newMovie) {
      setHasLoadingError(true);
    } else {
      const imgUrl = (newMovie.Poster === 'N/A')
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : newMovie.Poster;

      setMovie({
        title: newMovie.Title,
        description: newMovie.Plot,
        imdbId: newMovie.imdbID,
        imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
        imgUrl,
      });
    }

    setLoading(false);
  }

  function handleFindMovie(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    event.preventDefault();
    findMovie();
  }

  function addMovie() {
    setHasLoadingError(false);

    if (movie) {
      onAddMovie(movie);
    }

    setQuery('');
    setMovie(undefined);
  }

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
              className="input is-dander"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {hasLoadingError && (
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
              className={classNames('button',
                { 'is-loading': loading },
                { 'is-light': !loading })}
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
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
