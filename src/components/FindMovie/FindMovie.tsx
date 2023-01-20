import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onMovie: React.Dispatch<React.SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({ onMovie }) => {
  const [query, setQuery] = useState<string>('');
  const [findMovie, setFindMovie] = useState<Movie | null >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setFindMovie(null);
    event.preventDefault();
    try {
      setLoading(true);
      const response = await getMovie(query);

      if ('Error' in response) {
        setError(true);
        setLoading(false);

        return;
      }

      const {
        Title,
        Poster,
        Plot,
        imdbID,
      } = response;

      if (response === null) {
        return;
      }

      setFindMovie({
        title: Title,
        description: Plot,
        imgUrl: Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlerAddMovie = () => {
    onMovie((prev) => {
      if (!findMovie) {
        return prev;
      }

      const hasMovie = (prev.some(movie => movie.imdbId === findMovie?.imdbId));

      if (hasMovie) {
        alert('you have same');

        return prev;
      }

      return [...prev, findMovie];
    });

    setQuery('');
    setFindMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              onChange={(event) => {
                setError(false);
                setQuery(event.currentTarget.value);
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': loading },
              )}
              style={{ width: '114px' }}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {findMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handlerAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {findMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findMovie} />
        </div>
      )}
    </>
  );
};
