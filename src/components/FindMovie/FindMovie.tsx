import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  prevMovieList: Movie[];
  onMovieAdd: (newMovies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({
  prevMovieList,
  onMovieAdd,
}) => {
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFoundMovie, setIsNotFoundMovie] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsNotFoundMovie(false);
  };

  const handleSearch = () => {
    setIsLoading(true);

    getMovie(query.trim())
      .then((movie) => {
        if ((movie as ResponseError).Response === 'False') {
          setFoundMovie(null);
          setIsNotFoundMovie(true);
        } else {
          const newMovie = movie as MovieData;
          const poster = newMovie.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : newMovie.Poster;

          setFoundMovie({
            title: newMovie.Title,
            description: newMovie.Plot,
            imgUrl: poster,
            imdbId: newMovie.imdbID,
            imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = () => {
    setQuery('');
    setFoundMovie(null);
    setIsNotFoundMovie(false);

    if (
      foundMovie && !prevMovieList.find(m => m.imdbId === foundMovie.imdbId)
    ) {
      onMovieAdd([...prevMovieList, foundMovie]);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={(event) => event.preventDefault()}>
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
              className={cn('input', {
                'is-danger': isNotFoundMovie,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {isNotFoundMovie && (
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
              className={cn('button is-link', {
                'is-loading': isLoading,
              })}
              disabled={query.trim() === ''}
              onClick={handleSearch}
            >
              {foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
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
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
