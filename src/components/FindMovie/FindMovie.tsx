import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  handleNewMovie?: (movie: Movie) => void;
}

function isMovieData(obj: ResponseError | MovieData): obj is MovieData {
  return (
    obj &&
    (obj as MovieData).Poster !== undefined &&
    (obj as MovieData).Title !== undefined &&
    (obj as MovieData).Plot !== undefined &&
    (obj as MovieData).imdbID !== undefined
  );
}

export const FindMovie: React.FC<Props> = ({ handleNewMovie = () => {} }) => {
  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setFetchError(false);
  }

  const handleMovieFetch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!query) {
      return;
    }

    setLoading(true);
    getMovie(query)
      .then((rawData => {
        if (!isMovieData(rawData)) {
          throw new Error();
        }

        const moviePoster = rawData.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : rawData.Poster;

        const newMovie: Movie = {
          title: rawData.Title,
          description: rawData.Plot,
          imgUrl: moviePoster,
          imdbUrl: `https://www.imdb.com/title/${rawData.imdbID}`,
          imdbId: rawData.imdbID,
        }

        setMovie(newMovie);
      }))
      .catch(() => {
        setFetchError(true);
      })
      .finally(() => setLoading(false));
  }

  const handleAddMovie = (newMovie: Movie) => {
    handleNewMovie(newMovie);
    setMovie(null);
  }

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
              className={cn("input", { 'is-danger': fetchError })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {fetchError && (
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
              className={cn("button is-light", { 'is-loading': loading })}
              onClick={handleMovieFetch}
              disabled={loading || !query}
            >
              {!loading && movie ? `Search again` : `Find a movie`}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {handleAddMovie(movie)}}
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
