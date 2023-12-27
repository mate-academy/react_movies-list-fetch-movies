import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

interface Props {
  movies: Movie[],
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<Props> = ({
  movies,
  setMovies,
}) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie>();

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
              className={cn('input', {
                'is-danger': errorMessage,
              })}
              value={movieTitle}
              onChange={(e) => {
                setMovieTitle(e.target.value);
                if (errorMessage) {
                  setErrorMessage('');
                }
              }}
            />
          </div>

          {errorMessage && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!movieTitle || !!errorMessage}
              onClick={(e) => {
                e.preventDefault();
                setIsLoading(true);

                getMovie(movieTitle.toLowerCase())
                  .then(responseMovie => {
                    if (Object.keys(responseMovie).includes('Error')) {
                      setErrorMessage("Can't find a movie with such a title");
                      setMovie(undefined);
                    }

                    if (!('Error' in responseMovie)) {
                      setErrorMessage('');

                      const imageUrl = responseMovie.Poster !== 'N/A'
                        ? responseMovie.Poster
                        : 'https://via.placeholder.com'
                        + '/360x270.png?text=no%20preview';
                      const movieUrl = `https://www.imdb.com/title/${responseMovie.imdbID}`;

                      setMovie({
                        title: responseMovie.Title,
                        description: responseMovie.Plot,
                        imgUrl: imageUrl,
                        imdbUrl: movieUrl,
                        imdbId: responseMovie.imdbID,
                      });
                    }
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
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
                  let includes = false;

                  movies.forEach(listMovie => {
                    if (listMovie.imdbId === movie.imdbId) {
                      includes = true;
                    }
                  });

                  setMovie(undefined);
                  setMovieTitle('');
                  if (!includes) {
                    setMovies((oldMovies) => {
                      return [...oldMovies, movie];
                    });
                  }
                }}
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
