import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  savedMovies: Movie[];
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({
  savedMovies,
  onAddMovie,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [findMovie, setFindMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const handleAddClick = () => {
    if (findMovie) {
      if (!(savedMovies.some(movie => movie.imdbId === findMovie?.imdbId))) {
        onAddMovie(findMovie);
      }

      setQuery('');
      setFindMovie(null);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(false);

    getMovie(query)
      .then(data => {
        if (data.Response === 'True') {
          setFindMovie({
            title: data.Title,
            description: data.Plot,
            imdbId: data.imdbID,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imgUrl: data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster,
          });
        } else {
          setFindMovie(null);
          setError(true);
        }
      })
      .catch(() => {
        setFindMovie(null);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

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
              className={`input ${error ? `is-danger` : ``}`}
              value={query}
              onChange={handleInputChange}
            />
          </div>
          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can’t find a movie with such a title
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={!query}
              className={`button is-light ${loading ? `is-loading` : ``}`}
            >
              {findMovie ? `Search again` : `Find a movie`}
            </button>
          </div>

          <div className="control">
            {findMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddClick}
              >
                Add to the list
              </button>
            )}
          </div>
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
