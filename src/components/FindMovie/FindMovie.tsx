import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMsg(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    getMovie(query)
      .then(movie => {
        if ('Error' in movie) {
          setErrorMsg("Can't find a movie with such a title");
        } else {
          setFoundMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl:
              movie.Poster !== 'N/A'
                ? movie.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: 'https://www.imdb.com/title/' + movie.imdbID,
            imdbId: movie.imdbID,
          });
        }
      })
      .catch(() => {
        setErrorMsg('Try again');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (foundMovie) {
      onAdd(foundMovie);
      setQuery('');
      setFoundMovie(null);
    }
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
              className={`input ${errorMsg ? 'is-danger' : ''}`}
              onChange={handleChange}
            />
          </div>

          {errorMsg && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMsg}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={!query.trim()}
            >
              {foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
