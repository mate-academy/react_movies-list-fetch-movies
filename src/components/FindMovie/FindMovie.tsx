import React, { useState } from 'react';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie'; // Импортируем Movie

interface Props {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>; //
}

function isResponseError(res: MovieData | ResponseError): res is ResponseError {
  return (res as ResponseError).Response === 'False';
}

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [btnIsLoading, setBtnIsLoading] = useState(false);
  const [addBtnIsActive, setAddBtnIsActive] = useState(false);
  const [searchBtnIsActive, setSearchBtnIsActive] = useState(true);
  const [btnTitle, setBtnTitle] = useState('Find a movie');
  const [isError, setIsError] = useState(false);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchQuery(value);
    setSearchBtnIsActive(!value);
    setIsError(false);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnIsLoading(true);
    setIsError(false);

    getMovie(searchQuery)
      .then(res => {
        if (isResponseError(res)) {
          setIsError(true);

          return;
        }

        const mappedMovie: Movie = {
          title: res.Title,
          description: res.Plot,
          imgUrl:
            res.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : res.Poster,
          imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
          imdbId: res.imdbID,
        };

        setMovie(mappedMovie);
        setBtnTitle('Search again');
        setAddBtnIsActive(true);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setBtnIsLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    setMovies(prevMovies => {
      if (prevMovies.some(m => m.imdbId === movie.imdbId)) {
        return prevMovies;
      }

      return [...prevMovies, movie];
    });

    setMovie(null);
    setSearchQuery('');
    setAddBtnIsActive(false);
    setBtnTitle('Find a movie');
  };

  return (
    <>
      <form onSubmit={handleSearch} className="find-movie">
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
              value={searchQuery}
              onChange={handleSearchInput}
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
                'is-loading': btnIsLoading,
              })}
              disabled={!searchQuery || searchBtnIsActive}
            >
              {btnTitle}
            </button>
          </div>

          <div className="control">
            {addBtnIsActive && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
