import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
}

// eslint-disable-next-line max-len
const DEFAULT_IMG_URL = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie>({
    title: '',
    description: '',
    imgUrl: DEFAULT_IMG_URL,
    imdbUrl: '',
    imdbId: '',
  });
  const [isFounded, setIsFounded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  function handlerSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(!isLoading);

    getMovie(query).then(movieFromServer => {
      if (Object.hasOwn(movieFromServer, 'Error')) {
        setIsFounded(false);
      } else {
        const movieChoosed = movieFromServer as MovieData;

        setMovie({
          title: movieChoosed.Title,
          description: movieChoosed.Plot,
          imgUrl: movieChoosed.Poster !== 'N/A'
            ? movieChoosed.Poster
            : DEFAULT_IMG_URL,
          imdbUrl: `https://www.imdb.com/title/${movieChoosed.imdbID}`,
          imdbId: movieChoosed.imdbID,
        });
        setIsFounded(true);
      }
    })
      .finally(() => setIsLoading(false));
  }

  function handlerClick() {
    setMovies(
      currentMovies => {
        if (!currentMovies
          .some(currentMovie => currentMovie
            .imdbId === movie.imdbId)) {
          return [...currentMovies, movie];
        }

        return [...currentMovies];
      },
    );
    setQuery('');
    setMovie({
      title: '',
      description: '',
      imgUrl: '',
      imdbUrl: '',
      imdbId: '',
    });
    setIsFounded(true);
  }

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handlerSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              onChange={(event) => {
                setQuery(event.target.value);
                setIsFounded(true);
              }}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input',
                { 'is-danger': !isFounded && query })}
            />
          </div>

          {!isFounded && query && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
            >
              {movie.title ? ('Search again') : ('Find a movie')}
            </button>
          </div>

          {movie.title && (
            <div className="control">
              <button
                onClick={handlerClick}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      {movie.title && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
