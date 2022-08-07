import React, { useState, useEffect } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  getMovies: (movies: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ getMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [arr, getArr] = useState<Movie[]>([]);

  const getFetchetMovie = async (value: string) => {
    await getMovie(value)
      .then((res) => {
        if (!res.Title.toLowerCase().includes(value.toLowerCase())) {
          return;
        }

        const preparedMovie: Movie = {
          title: res.Title,
          description: res.Plot,
          imgUrl: res.Poster,
          imdbUrl: res.Poster,
          imdbId: res.imdbID,
        };

        setMovie(preparedMovie);
      })
      .catch(error => {
        setIsError(true);
        // eslint-disable-next-line no-console
        console.log('errrr', error);
      });
  };

  useEffect(() => {
    if (movie) {
      getMovies(arr);
    }
  }, [arr]);

  const handleClick = (event: any) => {
    event.preventDefault();
    getFetchetMovie(query);
    setQuery('');
    setMovie(null);
    setIsError(false);
  };

  const addMovieToMovies = () => {
    if (movie !== null && arr.every(m => m.title !== movie.title)) {
      getMovies(arr);
      getArr([...arr, movie]);
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
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
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
            {query.length === 0 ? (
              <button
                data-cy="searchButton"
                type="submit"
                className="button is-light"
                onClick={handleClick}
                disabled
              >
                Find a movie
              </button>
            ) : (
              <button
                data-cy="searchButton"
                type="submit"
                className="button is-light"
                onClick={handleClick}
              >
                Find a movie
              </button>
            )}

          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToMovies}
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
