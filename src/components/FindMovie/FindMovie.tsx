import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';

type Props = {
  addMovie: (movieToAdd: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const handleFind = async (event: React.FormEvent) => {
    event.preventDefault();
    setWaiting(true);
    const data = await getMovie(query);

    if ('Error' in data) {
      setError(true);
      setMovie(null);
      setWaiting(false);

      return;
    }

    const searchedMovie = {
      title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };

    if (searchedMovie.imgUrl === 'N/A') {
      searchedMovie.imgUrl
        = 'https://via.placeholder.com/360x270.png?text=no%20preview';
    }

    setMovie(searchedMovie);
    setError(false);
  };

  const handleAdd = () => {
    if (movie) {
      addMovie(movie);
    }

    setMovie(null);
    setQuery('');
    setWaiting(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFind}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={query}
              placeholder="Enter a title to search"
              className="input is-dander"
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
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
              data-cy="searchButton"
              type="submit"
              className={
                classNames(
                  'button is-light',
                  { 'is-loading': !movie && waiting },
                )
              }
              disabled={!query}
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
                onClick={handleAdd}
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
