import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie, normalizeMovieData } from '../../api';
// import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovieToList: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovieToList }) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setHasSearched(true);
    getMovie(query)
      .then((response) => {
        if ('Title' in response) {
          const normalizedMovie = normalizeMovieData(response as MovieData);

          setSelectedMovie(normalizedMovie);
        } else {
          setError('Can\'t find a movie with such a title');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (selectedMovie) {
      addMovieToList(selectedMovie);
      setQuery('');
      setSelectedMovie(null);
      setError(null);
      setHasSearched(false);
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
              value={query}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              onChange={(e) => {
                setError(null);
                setQuery(e.target.value);
              }}
            />
            {error && (
              <p className="help is-danger" data-cy="errorMessage">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={!query}
              onClick={handleSearch}
            >
              {`${!hasSearched ? 'Find a movie' : 'Search again'}`}
            </button>
          </div>

          {selectedMovie && (
            <>
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
            </>
          )}
        </div>
        {selectedMovie && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={selectedMovie} />
          </div>
        )}
      </form>
    </>
  );
};
