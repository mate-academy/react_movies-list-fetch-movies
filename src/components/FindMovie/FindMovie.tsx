import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

interface FindMovieProps {
  onAddMovie: (movie: Movie) => void;
  movies: Movie[]
}

export const FindMovie: React.FC<FindMovieProps> = ({ onAddMovie, movies }) => {
  const [query, setQuery] = useState('');
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [errorMovie, setErrorMovie] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchButtonClick: React
    .MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await getMovie(query);

      if ('Title' in result) {
        const movie: Movie = {
          title: result.Title,
          description: result.Plot,
          imgUrl: result.Poster !== 'N/A'
            ? result.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imdbId: result.imdbID,
        };

        setQuery('');
        setErrorMovie(false);
        setMovieData(movie);
      } else {
        setMovieData(null);
        setErrorMovie(true);
      }
    } finally {
      setIsLoading(false); // Step 3: Set loading state to false
    }
  };

  const handleAddButtonClick = () => {
    if (movieData) {
      const isMovieAlreadyAdded = movies
        .some(movie => movie.imdbId === movieData.imdbId);

      if (isMovieAlreadyAdded) {
        setMovieData(null);
      } else {
        onAddMovie(movieData);
        setMovieData(null);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setErrorMovie(false);
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
              className={classNames('input', {
                'is-danger': errorMovie,
              })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {errorMovie && (
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
              disabled={query === ''}
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              onClick={handleSearchButtonClick}
            >
              Find a movie
            </button>
          </div>

          {movieData !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButtonClick}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieData !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movieData && <MovieCard movie={movieData} />}
        </div>
      )}
    </>
  );
};
