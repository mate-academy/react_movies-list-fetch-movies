import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  setMovies(movies: Movie[]): void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [showError, setShowError] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [canFind, setCanFind] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handeSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCanFind(false);
    setIsLoading(true);

    try {
      const response = await getMovie(title);

      if ('Error' in response) {
        setShowError(true);

        return;
      }

      setCurrentMovie({
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster === 'N/A'
          // eslint-disable-next-line max-len
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (currentMovie
      && !movies.some(movie => movie.imdbId
        === currentMovie.imdbId)) {
      setMovies([...movies, currentMovie]);
    }

    setTitle('');
    setCurrentMovie(null);
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
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setShowError(false);
                setCanFind(true);
              }}
            />
          </div>

          {showError && (
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
              className={
                classNames('button', 'is-light', { 'is-loading': isLoading })
              }
              onClick={handeSubmit}
              disabled={!canFind || !title}
            >
              {currentMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className={
                classNames(
                  'button',
                  'is-primary',
                  { 'is-hidden': currentMovie === null },
                )
              }
              onClick={handleClear}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {currentMovie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};
