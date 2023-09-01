import classNames from 'classnames';

import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

const imdbLink = 'https://www.imdb.com/title';
const defaultImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  setFoundMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ setFoundMovie }) => {
  const [isError, setIsError] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
    setIsError(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result: MovieData | ResponseError = await getMovie(
        searchInputValue.trim(),
      );

      if ('Response' in result && result.Response === 'False') {
        setIsError(true);
      } else {
        setIsError(false);

        if ('Title' in result) {
          const movieData: Movie = {
            title: result.Title,
            description: result.Plot,
            imgUrl: result.Poster
            && result.Poster !== 'N/A' ? result.Poster : defaultImg,
            imdbUrl: `${imdbLink}/${result.imdbID}`,
            imdbId: result.imdbID,
          };

          setNewMovie(movieData);
        }
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieAdd = () => {
    if (newMovie) {
      setFoundMovie(newMovie);
      setSearchInputValue('');
      setNewMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFormSubmit}
      >
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
              className={classNames('input', { 'is-danger': isError })}
              value={searchInputValue}
              onChange={handleInputChange}
            />
          </div>

          {isError && (
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
                'button', 'is-light', { 'is-loading': isLoading },
              )}
              onClick={handleFormSubmit}
              disabled={searchInputValue === ''}
            >
              {!newMovie ? (
                'Find a movie'
              ) : (
                'Search again'
              )}
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleMovieAdd}
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
