import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: Movie[];
  setMovies:React.Dispatch<React.SetStateAction<Movie[]>>;
};
export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [inputValue, setInputValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [buttonContent, setButtonContent] = useState('Find a movie');
  const DEFAULT_IMG
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const findMovie = (event: React.MouseEvent) => {
    event.preventDefault();
    setLoading(true);
    if (error) {
      setError(false);
    }

    getMovie(inputValue)
      .then((response: MovieData | ResponseError) => {
        if ('Title' in response) {
          const {
            Poster,
            Title,
            Plot,
            imdbID,
          } = response;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A' ? DEFAULT_IMG : Poster,
            imdbId: imdbID,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          });
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => {
        setLoading(false);
        setButtonContent('Search again');
      });
  };

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (error) {
      setError(false);
    }

    setInputValue(value);
  };

  const handleAddMovie = () => {
    if (movie && movies.some((m) => m.imdbId === movie.imdbId)) {
      setMovie(null);
      setInputValue('');
      setButtonContent('Find a movie');
    } else if (movie) {
      setMovies((prevMovies) => [...prevMovies, movie]);
      setMovie(null);
      setInputValue('');
      setButtonContent('Find a movie');
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
              className={cn('input', { 'is-danger': error })}
              value={inputValue}
              onChange={(e) => handleInputValue(e)}
              onFocus={() => setError(false)}
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
              className={cn({
                'button is-light': !isLoading,
                'button is-loading': isLoading,
              })}
              onClick={findMovie}
              disabled={!inputValue}
            >
              {buttonContent}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
