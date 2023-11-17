import cn from 'classnames';
import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  movies: Movie[],
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [searched, setSearched] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<ResponseError | null>(null);
  const [searhProcessed, setSearhProcessed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);

    getMovie(searched)
      .then((result) => {
        if ((result as MovieData).imdbID) {
          const found: Movie = {
            title: (result as MovieData).Title,
            description: (result as MovieData).Plot,
            imgUrl: (result as MovieData).Poster !== 'N/A'
              ? (result as MovieData).Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${(result as MovieData).imdbID}`,
            imdbId: (result as MovieData).imdbID,
          };

          setFoundMovie(found);
          setError(null);
        }

        if ((result as ResponseError).Error) {
          const errorResponse: ResponseError = {
            Response: (result as ResponseError).Response,
            Error: (result as ResponseError).Error,
          };

          setError(errorResponse);
          setFoundMovie(null);
        }

        setSearhProcessed(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    if (!movies.find(movie => movie.imdbId === foundMovie?.imdbId)) {
      if (foundMovie) {
        setMovies((currentMovies: Movie[]) => [...currentMovies, foundMovie]);
      }
    }

    setSearched('');
    setError(null);
    setFoundMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => {
          e.preventDefault();
          handleClick();
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
              className={cn({ input: true, 'is-danger': error })}
              value={searched}
              onChange={(event) => {
                setSearched(event.target.value);
                setError(null);
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
              data-cy="searchButton"
              type="button"
              className={cn({
                button: true,
                'is-light': true,
                'is-loading': loading,
              })}
              disabled={!searched}
              onClick={() => handleClick()}
            >
              {!searhProcessed ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
