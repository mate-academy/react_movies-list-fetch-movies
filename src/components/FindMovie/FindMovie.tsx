import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  query: string;
  setQuery: (query: string) => void;
  movies: Movie[] | null;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  setMovies,
  movies,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loadingButtonFindAMovie, setLoadingButtonFindAMovie] = useState(false);
  const [buttonFindAMovie, setButtonFindAMovie] = useState(false);
  const [haveError, setHaveError] = useState(false);

  const apiKey = '601983d6';

  const moviesNotFound = movie?.Response === 'False';

  const changeFindMovie = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setLoadingButtonFindAMovie(true);

    getMovie(query, apiKey)
      .then((data: MovieData | ResponseError) => {
        setMovie(data);

        if (data.Response === 'False') {
          setHaveError(true);
        } else {
          setHaveError(false);
          setButtonFindAMovie(true);
        }
      })
      .finally(() => {
        setLoadingButtonFindAMovie(false);
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
              value={query}
              placeholder="Enter a title to search"
              className={haveError ? 'input is-danger' : 'input'}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
                setHaveError(false);
              }}
            />
          </div>

          {haveError && (
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
              className={`button is-light ${loadingButtonFindAMovie ? 'is-loading' : ''}`}
              disabled={!query.trim()}
              onClick={changeFindMovie}
            >
              Find a movie
            </button>
          </div>

          {!moviesNotFound && query.length > 0 && buttonFindAMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={event => {
                  event.preventDefault();

                  if (!movie) {
                    return;
                  }

                  if (!movies) {
                    return;
                  }

                  const alreadyExists = movies.some(
                    m => m.imdbID === movie.imdbID,
                  );

                  if (alreadyExists) {
                    setQuery('');
                    setMovie(null);
                    setButtonFindAMovie(false);
                  } else {
                    setMovies(prev => [...prev, movie]);
                    setQuery('');
                    setMovie(null);
                    setButtonFindAMovie(false);
                  }
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && !moviesNotFound && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
