import React, { useState } from 'react';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovies: (movie:Movie)=>void
};

export const FindMovie: React.FC<Props> = ({ addMovies }) => {
  const [query, setQuery] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleClick = () => {
    if (movie) {
      addMovies(movie);
      setQuery('');
      setMovie(null);
      setErrorStatus(true);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setErrorStatus(true);
        } else {
          const {
            Title,
            Plot,
            Poster,
            imdbID,
          } = data;
          const BASE_MOVIE_URL = 'https://www.imdb.com/title';

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
            imdbUrl: `${BASE_MOVIE_URL}/${imdbID}`,
            imdbId: imdbID,
          });
        }
      })

      .finally(() => setLoading(false));
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(ev.target.value);
    setErrorStatus(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={(ev) => handleSubmit(ev)}>
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
              className={cn('input', { 'is-danger': errorStatus })}
              value={query}
              onChange={handleChange}
            />
          </div>

          {errorStatus && (
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
              className={cn('button', 'is-light', { 'is-loading': loading })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>
          {movie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleClick()}
              >
                Add to the list
              </button>
            </div>
          )}

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
