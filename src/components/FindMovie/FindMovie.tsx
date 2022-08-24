import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const emptyMovie = {
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  };

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [activeMovie, setActiveMovie] = useState<Movie>(emptyMovie);

  const findMovie = () => {
    setIsLoading(true);

    let movie: Movie = emptyMovie;

    getMovie(query)
      .then((response) => {
        if (response.Response === 'False') {
          setIsFound(false);
          setIsLoading(false);
          setIsTouched(true);
          setActiveMovie(emptyMovie);

          return;
        }

        setIsLoading(false);
        setIsFound(true);
        setIsTouched(true);

        movie = {
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster
            || 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        };

        setActiveMovie(movie);
      });
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
              value={query}
              onChange={(e) => {
                setQuery(e.currentTarget.value);
              }}
            />
          </div>

          {!isFound && isTouched
          && (

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
              disabled={query === ''}
              onClick={(e) => {
                e.preventDefault();
                findMovie();
              }}
              className={
                classNames(
                  'button',
                  'is-light',
                  { 'is-loading': isLoading },
                )
              }
            >
              Find a movie
            </button>
          </div>

          {isFound
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={() => {
                    addMovie(activeMovie);
                    setQuery('');
                    setActiveMovie(emptyMovie);
                    setIsFound(false);
                    setIsTouched(false);
                  }}
                >
                  Add to the list
                </button>
              </div>
            )}

        </div>
      </form>

      {isFound && activeMovie !== emptyMovie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={activeMovie} />
          </div>
        )}
    </>
  );
};
