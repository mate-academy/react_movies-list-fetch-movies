import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  query: string;
  setQuery: (query: string) => void;
  isLoading: boolean;
  setIsLoading: (query: boolean) => void;
  movie: Movie | null;
  movies: Movie[];
  setMovie: (movie: Movie | null) => void;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  isLoading,
  setIsLoading,
  movie,
  movies,
  setMovie,
  setMovies,
}) => {
  const [noMovieFind, setNoMovieFind] = useState(false);
  const HandleChange: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNoMovieFind(false);
    setQuery(event.target.value);
  };

  const mapMovie = (data: MovieData): Movie => {
    return {
      title: data.Title,
      description: data.Plot,
      imgUrl:
        !data.Poster || data.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : data.Poster,
      imdbId: data.imdbID,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    };
  };

  const findAMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setMovie(null);
          setNoMovieFind(true);

          return;
        }

        setMovie(mapMovie(data));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addMovie = () => {
    if (!movie) {
      return;
    }

    if (movies.find(m => m.imdbId === movie.imdbId)) {
      setQuery('');
      setMovie(null);

      return;
    }

    setMovies(prev => [...prev, movie]);
    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={findAMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              value={query}
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${noMovieFind ? 'is-danger' : ''}`}
              onChange={HandleChange}
            />
          </div>

          {noMovieFind && (
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={query === ''}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
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
