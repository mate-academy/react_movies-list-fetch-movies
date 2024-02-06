import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  setMoviesList: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({
  setMoviesList,
}) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  const defImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const findMovie = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (query.trim() !== '') {
      setIsLoading(true);

      getMovie(query)
        .then((data) => {
          setIsLoading(false);

          if ('Error' in data) {
            setError(true);
          } else {
            const movie: Movie = {
              title: data.Title,
              description: data.Plot,
              imgUrl: data.Poster || defImg,
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
              imdbId: data.imdbID,
            };

            setMovies([movie]);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    setError(false);
  }, [query]);

  const addToMovieList = () => {
    setMoviesList(prevMovie => [...prevMovie, ...movies]);
    setQuery('');
    setMovies([]);
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
              disabled={!query}
              className={cn('button',
                { 'is-light': query, 'is-loading': isLoading })}
              onClick={(e) => findMovie(e)}
            >
              {movies.length > 0 ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movies.length > 0 && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addToMovieList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movies.length > 0 && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movies.map(movie => (
            <MovieCard movie={movie} key={movie.imdbId} />
          ))}
        </div>
      )}
    </>
  );
};
