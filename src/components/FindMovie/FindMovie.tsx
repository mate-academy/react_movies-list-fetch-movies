import React, { useState } from 'react';

import './FindMovie.scss';

import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type FindMovieProps = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<FindMovieProps> = ({ setMovies }) => {
  const [movie, setMovie] = useState<string>('');
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean | null>(false);

  function mapMovieDataToMovie(data: MovieData): Movie {
    return {
      title: data.Title,
      description: data.Plot,
      imgUrl:
        data.Poster && data.Poster !== 'N/A'
          ? data.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movie.trim()) {
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const response = await getMovie(movie.trim());

      if ('Error' in response) {
        setError(true);
        setMovieData(null);
      } else {
        setMovieData(mapMovieDataToMovie(response));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!movieData) {
      return;
    }

    setMovies(prev => {
      if (prev.some(m => m.imdbId === movieData.imdbId)) {
        return prev;
      }

      return [...prev, movieData];
    });

    setMovie('');
    setMovieData(null);
    setError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              value={movie}
              onChange={e => {
                setMovie(e.target.value);
                setError(false);
              }}
            />
          </div>

          {error ? (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          ) : (
            ''
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={movie === ''}
            >
              Find a movie
            </button>
          </div>

          {movieData && !error ? (
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
          ) : null}
        </div>
      </form>

      {movieData && !error ? (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieData} />
        </div>
      ) : (
        ''
      )}
    </>
  );
};
