import React, { Dispatch, SetStateAction, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ResponseError';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  setMovies: Dispatch<SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    event.preventDefault();
    setErrorMessage('');
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    if (query.trim() !== '') {
      getMovie(query)
        .then((data: MovieData | ResponseError) => {
          if (!('Error' in data)) {
            setMovie({
              title: data.Title,
              description: data.Plot,
              imgUrl:
                data.Poster !== 'N/A'
                  ? data.Poster
                  : 'https://via.placeholder.com/360x270.png?text=no%20preview',
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
              imdbId: data.imdbID,
            });
          } else {
            setErrorMessage('Can&apos;t find a movie with such a title');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleAddingToList = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (movie) {
      setMovies(prevMovies => {
        if (prevMovies.some(prevMovie => prevMovie.imdbId === movie.imdbId)) {
          return prevMovies;
        }

        return [...prevMovies, movie];
      });

      setQuery('');
      setMovie(null);
      setErrorMessage('');
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
              className={!errorMessage ? 'input' : 'input is-danger'}
              value={query}
              onChange={handleInput}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={!query}
              onClick={handleSubmit}
            >
              Find a movie
            </button>
          </div>

          {!errorMessage && query && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddingToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!errorMessage && movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {<MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
