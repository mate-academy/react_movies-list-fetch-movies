import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = (
  // movies,
  // setMovies,
) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      getMovie(query)
        .then((movieFromServer) => {
          if (movieFromServer) {
            setNewMovie({
              title: movieFromServer.Title,
              description: movieFromServer.Plot,
              imgUrl: movieFromServer.Poster,
              imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
              imdbId: movieFromServer.imdbID,
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [query, isLoading]);

  // const addMovie = (newMovie: Movie) => {
  //   setMovies([...movies, newMovie]);
  // }

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
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="button"
              className={cn('button', 'is-light')}
              disabled={query.length === 0}
              onClick={() => setIsLoading(true)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        <MovieCard movie={newMovie} />
      </div>
    </>
  );
};
