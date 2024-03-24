import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: (movies: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isErorr, setIsErorr] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>();

  const changeType = (data: MovieData) => ({
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  });

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsErorr(false);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if ('Error' in data) {
          setIsErorr(true);

          return;
        }

        setNewMovie(changeType(data));
        setIsErorr(false);
      })
      .finally(() => setLoading(false));
  };

  const handleAddNewMovie = () => {
    const isUnique = movies.every(movie => movie.imdbId !== newMovie?.imdbId);

    if (newMovie && isUnique) {
      setMovies([...movies, newMovie]);
    }

    setQuery('');
    setNewMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className={cn('input', { 'is-danger': isErorr })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {isErorr && (
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
              className={cn('button is-light', { 'is-loading': loading })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddNewMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
