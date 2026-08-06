import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  setMovies: (movies: Movie[]) => void;
  isError: boolean;
  setIsError: (err: boolean) => void;
  isLoading: boolean;
  setIsLoading: (el: boolean) => void;
};

export const FindMovie: React.FC<Props> = ({
  isError,
  setIsError,
  isLoading,
  setIsLoading,
  setMovies,
}) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const getTheMovie = () => {
    setIsLoading(true);
    setIsError(false);
    setMovie(null);
    getMovie(movieTitle)
      .then(data => {
        if (!data || data.Response === 'False') {
          throw new Error('Film not found');
        }

        if (!data) {
          throw new Error('Film not found');
        }

        const title: string = data.Title;
        const description: string = data.Plot;
        const imgUrl: string =
          data.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : data.Poster;
        const imdbId: string = data.imdbID;

        const normalizedMovie = {
          title: title,
          description: description,
          imgUrl: imgUrl,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: imdbId,
        };

        setMovie(normalizedMovie);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          event.preventDefault();
          if (movieTitle.length === 0) {
            return;
          } else {
            getTheMovie();
          }
        }}
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
              className={`input ${movieTitle.length === 0 && 'is-danger'}`}
              value={movieTitle}
              onChange={e => {
                setMovieTitle(e.target.value);
                setIsError(false);
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={movieTitle.length === 0}
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
                  setMovies(prevMovies => {
                    if (prevMovies.some(el => el.imdbId === movie.imdbId)) {
                      return prevMovies;
                    }

                    return [...prevMovies, movie];
                  });
                  setMovie(null);
                  setMovieTitle('');
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
