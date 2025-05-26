import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type FindMovieProps = {
  setMovies: (value: React.SetStateAction<Movie[]>) => void;
};

const isValidMovieData = (data: unknown): data is MovieData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'Title' in data &&
    'Poster' in data &&
    'Plot' in data &&
    'imdbID' in data
  );
};

export const FindMovie: React.FC<FindMovieProps> = ({ setMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchMovie = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = await getMovie(title.trim()).finally(() => {
      setLoading(false);
    });

    if (isValidMovieData(data)) {
      setMovie({
        title: data.Title,
        description: data.Plot,
        imgUrl: data.Poster,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      });
      setError(false);
    } else {
      setMovie(null);
      setError(true);
    }

    setTitle('');
  };

  const addMovieIfNotExists = (movieToAdd: Movie) => {
    setMovies((prev: Movie[]) =>
      prev.some((m: Movie) => m.imdbId === movieToAdd.imdbId)
        ? prev
        : [...prev, movieToAdd],
    );

    setMovie(null);
    setTitle('');
    setError(false);
    setLoading(false);
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setError(false);
              }}
            />
          </div>

          {error ? (
            <p className="help is-danger" data-cy="errorMessage">
              Please enter a valid movie title.
            </p>
          ) : null}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={!title.trim()}
              onClick={e => searchMovie(e)}
            >
              Find a movie
            </button>
          </div>

          {movie ? (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovieIfNotExists(movie)}
              >
                Add to the list
              </button>
            </div>
          ) : null}
        </div>
      </form>
      {movie ? (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      ) : null}
    </>
  );
};
