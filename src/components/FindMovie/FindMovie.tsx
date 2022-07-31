import classnames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  addMovieToFavorites: (movie:Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovieToFavorites }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foundedMovie, setFoundedMovie] = useState<Movie | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const searchHandler = async () => {
    setIsLoading(true);

    try {
      const searchResult = await getMovie(searchTerm);

      if ('Title' in searchResult) {
        const newMovie:Movie = {
          title: searchResult.Title,
          description: searchResult.Plot,
          imgUrl: searchResult.Poster !== 'N/A'
            ? searchResult.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbId: searchResult.imdbID,
          imdbUrl: `https://www.imdb.com/title/${searchResult.imdbID}`,
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
              className={
                classnames('button', 'is-light', { 'is-loading': isLoading })
              }
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
                    addMovieToFavorites(foundedMovie);
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
