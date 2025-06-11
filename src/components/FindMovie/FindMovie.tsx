import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type PropsFindMovie = {
  setMovies: (movies: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<PropsFindMovie> = ({ setMovies, movies }) => {
  const [query, setQuery] = useState('');
  const [movieData, setMovieData] = useState<MovieData | ResponseError>();
  const [error, setError] = useState(false);
  const [firstSearch, setFirstSearch] = useState(true);
  const [movieInfo, setMovieInfo] = useState<Movie>();
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(false);
    setIsLoading(true);
    getMovie(query)
      .then(movie => {
        if ((movie as ResponseError).Response === 'False') {
          setError(true);
        } else {
          setMovieData(movie);
        }
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (movieData) {
      const { Title, Plot, Poster, imdbID } = movieData as MovieData;

      setMovieInfo({
        title: Title,
        description: Plot,
        imgUrl: Poster
          ? Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      });
    }
  }, [movieData]);

  function handleMovie(newCard: Movie) {
    const duplicate = movies.find(movie => movie.imdbId === newCard.imdbId);

    if (duplicate) {
      setMovieData(undefined);
    } else {
      setMovies([...movies, newCard]);
      setQuery('');
      setMovieData(undefined);
    }
  }

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              className={`input ${error && query ? 'is-danger' : ''}`}
              value={query}
              onChange={ev => {
                setQuery(ev.target.value);
                setError(false);
              }}
            />
          </div>

          {error && query && (
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
              className={`button ${isLoading ? 'is-loading' : 'is-light'}`}
              disabled={query ? false : true}
              onClick={() => setFirstSearch(false)}
            >
              {firstSearch ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {(movieData as MovieData) && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movieInfo) {
                    handleMovie(movieInfo);
                  } else {
                    return;
                  }
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {(movieData as MovieData) && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieInfo} />
        </div>
      )}
    </>
  );
};
