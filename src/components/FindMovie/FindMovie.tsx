import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [loader, setLoader] = useState(false);
  const [error, SetError] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (submit) {
      const normalizedQuery = query.toLowerCase() || '';

      setLoader(true);

      getMovie(normalizedQuery)
        .then(data => {
          if ('Title' in data) {
            setMovieData(data);
          } else {
            SetError(true);
          }
        })
        .finally(() => {
          setLoader(false);
          setSubmit(false);
        });
    }
  }, [submit, query]);

  useEffect(() => {
    if (movieData) {
      const { Title, Plot, Poster, imdbID } = movieData;
      const movieContent: Movie = {
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      };

      setMovie(movieContent);
    }
  }, [movieData, setMovie]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
    SetError(false);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setSubmit(true);
  };

  const resset = () => {
    setQuery('');
    setMovieData(null);
    setMovie(null);
  };

  const handleAddMovie = () => {
    if (movies.length === 0) {
      setMovies([movie!]);
    } else {
      const checkMovie = movies.find(
        currentMovie => currentMovie.imdbId === movie?.imdbId,
      );

      if (!checkMovie) {
        setMovies(currentList => [...currentList, movie!]);
      }
    }

    resset();
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
              className="input is-danger"
              value={query}
              onChange={handleOnChange}
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
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': loader,
              })}
              disabled={query === ''}
              onClick={handleSubmit}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
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
