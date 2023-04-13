import './FindMovie.scss';
import { useState } from 'react';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie, defaultPicture } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

type Props = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({
  query, setQuery, setMovies, movies,
}) => {
  const [movie, setMovie] = useState<Movie>();
  const [fault, setFault] = useState<ResponseError>();
  const [loading, setLoading] = useState(false);

  const makeMovie = (movieData: MovieData) => (setMovie({
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieData.Poster === 'N/A' ? defaultPicture : movieData.Poster,
    imdbUrl: 'https://www.imdb.com/title/',
    imdbId: movieData.imdbID,
  }));

  const getMovieData = async (queryArg: string) => {
    try {
      setLoading(true);
      const response = await getMovie(queryArg);

      if ('Response' in response && response.Response === 'False') {
        throw new Error(response.Error);
      } else {
        makeMovie(response as MovieData);
      }
    } catch (error) {
      setFault(error as ResponseError);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = (movieArg: Movie) => {
    const isMovieAlreadyAdded = movies.some(
      (addedMovie) => addedMovie.imdbId === movieArg.imdbId,
    );

    if (isMovieAlreadyAdded) {
      return;
    }

    setMovies([...movies, movieArg]);
    setMovie(undefined);
    setQuery('');
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setFault(undefined);
              }}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {fault && "Can't find a movie with such a title"}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button', 'is-light', { 'is-loading': loading },
              )}
              onClick={(event) => {
                event.preventDefault();
                getMovieData(query);
              }}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(movie)}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
