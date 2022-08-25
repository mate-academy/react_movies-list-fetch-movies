import React, { useState } from 'react';
import ClassNames from 'classnames';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { Loader } from '../Loader';
import './FindMovie.scss';

interface Props {
  addToList: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addToList }) => {
  const [searchQuerry, setSearchQuerry] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoFilm, setIsNoFilm] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setIsLoading(true);

    getMovie(searchQuerry)
      .then(res => {
        setMovie({
          title: res.Title,
          description: res.Plot,
          imgUrl: res.Poster !== 'N/A' ? res.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbId: res.imdbID,
          imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
        });
        setIsLoading(false);
        setIsNoFilm(false);
      })
      .catch(error => {
        setMovie(null);
        // eslint-disable-next-line no-console
        console.log(error);
        setIsLoading(false);
        setIsNoFilm(true);
      });
  };

  const handleAddFilmToList = () => {
    if (movie) {
      addToList(movie);
    }

    setMovie(null);
    setIsNoFilm(false);
    setSearchQuerry('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              value={searchQuerry}
              onChange={event => {
                setIsNoFilm(false);
                setSearchQuerry(event.target.value);
              }}
            />
          </div>

          {isNoFilm && (
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
              className={ClassNames(
                'button is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={!searchQuerry}
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
                onClick={handleAddFilmToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!isLoading ? (
        <>
          {movie && (
            <div className="container" data-cy="previewContainer">
              <h2 className="title">Preview</h2>
              <MovieCard movie={movie} />
            </div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
