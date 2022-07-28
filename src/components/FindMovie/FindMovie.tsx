import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [search, setSearch] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isMovieFound, setIsMovieFound] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const searchForAMovie = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setLoading(true);

    const foundedMovie = await getMovie(search);

    if ('Title' in foundedMovie) {
      const movieToPreview = {
        title: foundedMovie.Title,
        description: foundedMovie.Plot,
        imgUrl: foundedMovie.Poster !== 'N/A' ? foundedMovie.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${foundedMovie.imdbID}`,
        imdbId: foundedMovie.imdbID,
      };

      setNewMovie(movieToPreview);
      setIsMovieFound(true);
    } else {
      setHasError(true);
    }

    setLoading(false);
  };

  const handleAddMovie = () => {
    if (newMovie !== null) {
      addMovie(newMovie);
      setHasError(false);
      setNewMovie(null);
      setSearch('');
      setIsMovieFound(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              value={search}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              onChange={(event) => {
                setSearch(event.target.value);
                setHasError(false);
              }}
            />
          </div>

          {hasError && (
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={search.length === 0}
              onClick={searchForAMovie}
            >
              {hasError ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {isMovieFound && (
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

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
