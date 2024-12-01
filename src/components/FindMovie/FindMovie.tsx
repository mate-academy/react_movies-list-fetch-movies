import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  onFind: (movie: Movie | undefined) => void;
  onAdd: (movie: Movie) => void;
  movie?: Movie;
}

export const FindMovie: React.FC<Props> = ({ onFind, movie, onAdd }) => {
  const [movieName, setMovieName] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const addBtnHandler = () => {
    if (movie) {
      onAdd(movie);
      onFind(undefined);
      setMovieName('');
    }
  };

  const inputHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (isError && movie) {
      onFind(undefined);
    }

    setMovieName(event.target.value);
    setIsError(false);
  };

  const findMovie: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault();
    setIsLoaded(true);
    getMovie(movieName)
      .then(newMovie => {
        if ('Poster' in newMovie) {
          const { Title: title, Plot: description, imdbID: imdbId } = newMovie;
          let { Poster: imgUrl } = newMovie;

          if (imgUrl === 'N/A') {
            imgUrl =
              'https://via.placeholder.com/360x270.png?text=no%20preview';
          }

          onFind({
            title,
            description,
            imgUrl,
            imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
            imdbId,
          });
        }

        if ('Error' in newMovie) {
          setIsError(true);
        }
      })
      // eslint-disable-next-line no-console
      .catch(error => console.error(error))
      .finally(() => setIsLoaded(false));
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
              className={`input ${isError && 'is-danger'}`}
              value={movieName}
              onChange={inputHandler}
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
              className={`button is-light ${isLoaded && 'is-loading'}`}
              disabled={!movieName}
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>
          {movie && !isError && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addBtnHandler}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && !isError && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
