/* eslint-disable max-len */
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  onAddMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [isErrorTitle, setIsErrorTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createMovie = (movie: MovieData) => {
    const {
      Title,
      Plot,
      Poster,
      imdbID,
    } = movie;

    setFoundMovie({
      title: Title,
      description: Plot,
      imdbId: imdbID,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imgUrl: Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
    });
  };

  const handleFindMovie = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsLoading(true);

    await getMovie(searchQuery)
      .then(movieFromServer => {
        if ('Error' in movieFromServer) {
          setIsErrorTitle(true);
        } else {
          createMovie(movieFromServer);
        }
      });

    setIsLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsErrorTitle(false);
  };

  const handleSubmitMovie = () => {
    if (foundMovie) {
      onAddMovie(foundMovie);
      setFoundMovie(null);
      setSearchQuery('');
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
              value={searchQuery}
              onChange={handleChange}
            />
          </div>

          {isErrorTitle && (
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
              className={isLoading ? 'button is-loading' : 'button is-light'}
              disabled={searchQuery.length === 0}
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleSubmitMovie}
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
