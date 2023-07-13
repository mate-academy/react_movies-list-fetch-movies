import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdd: (newMovie: Movie) => void,
};

const defaultImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const findMovie = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsError(false);
    setIsLoading(true);
    try {
      const res = await getMovie(query);

      if ((res as ResponseError).Error) {
        setIsError(true);
      } else {
        const response = res as MovieData;
        const img = response.Poster === 'N/A' ? defaultImg : response.Poster;
        const movie: Movie = {
          title: response.Title,
          description: response.Plot,
          imgUrl: img,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        };

        setFindedMovie(movie);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setQuery(event.target.value);
  };

  const handleAddMovie = (movie: Movie) => {
    onAdd(movie);
    setQuery('');
    setFindedMovie(null);
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
                'is-danger': isError,
              })}
              value={query}
              onChange={e => handleInputChange(e)}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={findMovie}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          {findedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(findedMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {findedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findedMovie} />
        </div>
      )}

    </>
  );
};
