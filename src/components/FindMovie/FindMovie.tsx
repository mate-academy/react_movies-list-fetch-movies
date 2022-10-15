import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

const noPosterURL = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  addMovie: (movie: Movie[]) => void,
  allMovies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ addMovie, allMovies }) => {
  const [qwery, setQwery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const searchMovie = async () => {
    setError(false);
    setIsLoading(true);

    try {
      const response = await getMovie(qwery);

      if ('Error' in response) {
        setError(true);
        setIsLoading(false);

        return;
      }

      setMovie({
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster === 'N/A'
          ? noPosterURL
          : response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      });
    } catch (err) {
      setError(true);
    }

    setIsLoading(false);
  };

  const addMovieHandler = () => {
    setQwery('');
    setMovie(null);

    if (movie && !allMovies.find(target => (
      target.imdbId === movie.imdbId
    ))) {
      addMovie([...allMovies, movie]);
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
              value={qwery}
              onChange={(event) => {
                setError(false);
                setQwery(event.target.value);
              }}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={qwery.length <= 0}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={(event) => {
                event.preventDefault();
                searchMovie();
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
                onClick={addMovieHandler}
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
