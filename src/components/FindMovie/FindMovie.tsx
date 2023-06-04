import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

interface Props {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [searchValue, setSearchValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const getImgUrl = (url: string) => {
    return url === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : url;
  };

  const normalizeMovie = (data: MovieData) => {
    const url = `https://www.imdb.com/title/${data.imdbID}`;

    const newMovie = {
      title: data.Title,
      description: data.Plot,
      imgUrl: getImgUrl(data.Poster),
      imdbUrl: url,
      imdbId: data.imdbID,
    };

    return newMovie;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoad(true);

    await getMovie(searchValue)
      .then((movieData) => {
        if ('imdbID' in movieData) {
          setMovie(normalizeMovie(movieData));
        } else {
          setIsError(true);
          setMovie(null);
        }
      })
      .finally(() => {
        setIsLoad(false);
      });
  };

  const searchHandler = (value: string) => {
    setSearchValue(value);
    setIsError(false);
  };

  const saveMovie = () => {
    if (movie) {
      onAdd(movie);
      searchHandler('');
      setMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={classNames(
                'input', {
                  'is-danger': isError,
                },
              )}
              value={searchValue}
              onChange={(event) => {
                searchHandler(event.target.value);
              }}
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
                'button is-light', {
                  'is-loading': isLoad,
                },
              )}
              disabled={!searchValue.length}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={saveMovie}

              >
                Add to the list
              </button>
            </div>
          )}
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
