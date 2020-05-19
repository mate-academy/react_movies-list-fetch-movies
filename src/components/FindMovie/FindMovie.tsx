import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovies } from '../../api/getMovies';

const defaultMovie: Movie = {
  title: '',
  description: '',
  imgUrl: '',
  imdbUrl: '',
  imdbId: '',
};

type Props = {
  movies: Movie[];
  setMovies: (value: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Movie>(defaultMovie);
  const [isLoaded, setLoaded] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState('');

  const findMovie = async () => {
    setLoading(true);
    const data = await getMovies(searchQuery)
      .then(response => response.json())
      .catch(error => {
        setLoading(false);
        setError(`Something went wrong! ${error.message}.`);
      });

    if (data) {
      const foundMovie: Movie = {
        title: data.Title,
        description: data.Plot,
        imgUrl: data.Poster,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      };

      setLoading(false);
      setLoaded(true);
      setSearchResult(foundMovie);
    }
  };

  const checkMovie = () => {
    if (!searchResult.imdbId) {
      return;
    }

    if (movies.find(movie => movie.imdbId === searchResult.imdbId)) {
      setError('This movie is already in the catalog.');

      return;
    }

    setMovies([...movies, searchResult]);
    setSearchResult(defaultMovie);
    setLoaded(false);
    setSearchQuery('');
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    findMovie();
  };

  const handleClickSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    checkMovie();
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>
          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': isError })}
              value={searchQuery}
              autoComplete="off"
              onChange={e => {
                setSearchQuery(e.target.value);
                setLoaded(false);
                setError('');
              }}
            />
          </div>
          {isError && <p className="help is-danger">{isError}</p>}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={cn('button is-warning', {
                'is-light': isLoaded,
                'is-loading': isLoading,
                'border-dark': isLoaded,
              })}
              disabled={isLoaded}
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className={cn('button is-warning', {
                'is-light': !isLoaded,
                'border-dark': !isLoaded,
              })}
              disabled={!isLoaded}
              onClick={handleClickSubmit}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {searchResult.imdbId && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...searchResult} />
        </div>
      )}
    </>
  );
};
