import React, { useCallback, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

const normalizeMovieData = (movieData: MovieData): Movie => {
  return {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl:
      movieData.Poster && movieData.Poster !== 'N/A'
        ? movieData.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: 'https://www.imdb.com/title/' + movieData.imdbID,
    imdbId: movieData.imdbID,
  };
};

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [showedMovie, setShowedMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMovie = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsLoading(true);

      getMovie(query)
        .then(data => {
          if (data.Response === 'True') {
            const normalizedData = normalizeMovieData(data);

            setShowedMovie(normalizedData);
          } else {
            setHasError(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [query],
  );

  return (
    <>
      <form className="find-movie" onSubmit={handleAddMovie}>
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
              value={query}
              className={`input`}
              onChange={event => {
                setQuery(event.target.value);
                setHasError(false);
              }}
            />
          </div>

          {hasError && (
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
              disabled={!query}
            >
              {showedMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          {showedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  const hasMovie = movies.find(
                    movie => movie.imdbId === showedMovie.imdbId,
                  );

                  if (!hasMovie) {
                    setMovies(prev => [...prev, showedMovie]);
                  }

                  setShowedMovie(null);
                  setQuery('');
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {showedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={showedMovie} />
        </div>
      )}
    </>
  );
};
