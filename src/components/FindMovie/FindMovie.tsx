import React, { useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovieToFavorites: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovieToFavorites }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foundedMovie, setFoundedMovie] = useState<Movie | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const searchHandler = async () => {
    setIsLoading(true);

    try {
      const res = await getMovie(searchTerm);

      if ('Title' in res) {
        const newMovie: Movie = {
          title: res.Title,
          description: res.Plot,
          imgUrl: res.Poster !== 'N/A'
            ? res.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbId: res.imdbID,
          imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
        };

        setFoundedMovie(newMovie);
      } else {
        setHasError(true);
      }
    } finally {
      setIsLoading(false);
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setHasError(false);
                setFoundedMovie(null);
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
              disabled={!searchTerm}
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
              onClick={(event) => {
                event.preventDefault();
                searchHandler();
              }}
            >
              Find a movie
            </button>
          </div>

          {foundedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (foundedMovie) {
                    onAddMovieToFavorites(foundedMovie);
                  }

                  setSearchTerm('');
                  setFoundedMovie(null);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundedMovie} />
        </div>
      )}
    </>
  );
};
