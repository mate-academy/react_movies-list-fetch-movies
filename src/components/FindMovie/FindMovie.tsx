import React, { Dispatch, SetStateAction, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface PropsFindMovie {
  setMovies: Dispatch<SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<PropsFindMovie> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    event.preventDefault();
    setErrorMessage('');
  };

  const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
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
                data.Poster === 'N/A'
                  ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                  : data.Poster,
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
              imdbId: data.imdbID,
            });
          } else {
            setErrorMessage(`Can't find a movie with such a title`);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handlerMovieAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (movie) {
      setMovies(prevMovies => {
        if (prevMovies.some(prevMovie => prevMovie.imdbId === movie.imdbId)) {
          return prevMovies;
        }

        return [...prevMovies, movie];
      });
      setQuery('');
      setMovie(undefined);
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
              onChange={handleInput}
              value={query}
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
              onClick={handleButton}
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            {query && !errorMessage && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handlerMovieAdd}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>
      {!errorMessage && movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
