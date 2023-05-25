import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ResponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  handleAddMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ handleAddMovie }) => {
  const [searchedValue, setSearchedValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const defaultImg
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedValue(event.target.value);
    setErrorMessage('');
  };

  const preparingMovie = (movieFromServer: MovieData): Movie => {
    return {
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl: movieFromServer.Poster !== 'N/A'
        ? movieFromServer.Poster
        : defaultImg,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
      imdbId: movieFromServer.imdbID,
    };
  };

  const submitSearch = () => {
    setIsLoading(true);
    getMovie(searchedValue).then(res => {
      if ((res as ResponseError).Error) {
        setErrorMessage((res as ResponseError).Error);
      } else {
        setMovie(preparingMovie(res as MovieData));
      }
    }).finally(() => setIsLoading(false));
  };

  const clearSearch = () => {
    setSearchedValue('');
    setMovie(null);
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
              className="input"
              value={searchedValue}
              onChange={handleSearch}
            />
          </div>
          {errorMessage.length > 0 && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
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
              disabled={!searchedValue.length}
              onClick={(event) => {
                event.preventDefault();
                submitSearch();
              }}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handleAddMovie(movie);
                  clearSearch();
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie
      && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
