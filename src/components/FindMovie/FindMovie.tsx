import React, { ChangeEvent, useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

const defaultPictureUrl
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

const createMovie = (data: MovieData): Movie => {
  const {
    Title, Poster, Plot, imdbID,
  } = data;
  const hasPoster = Poster !== 'N/A';
  const imdbUrl = `https://www.imdb.com/title/${imdbID}`;
  const imgUrl = hasPoster ? Poster : defaultPictureUrl;

  return {
    title: Title,
    description: Plot,
    imgUrl,
    imdbUrl,
    imdbId: imdbID,
  };
};

type FindMovieProps = {
  onMovieAdd: (movie: Movie) => boolean;
};

export const FindMovie: React.FC<FindMovieProps> = ({ onMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindMovie = async () => {
    setIsLoading(true);
    const movieData = await getMovie(query);

    if ('Error' in movieData) {
      setHasError(true);
    } else {
      const movie = createMovie(movieData);

      setSearchedMovie(movie);
    }

    setIsLoading(false);
  };

  const handleInputUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    if (hasError === true) {
      setHasError(false);
    }

    setQuery(e.target.value);
  };

  const handleMovieAdd = (movie: Movie) => {
    onMovieAdd(movie);
    setSearchedMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              value={query}
              onChange={handleInputUpdate}
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
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
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={cn(
                'button',
                'is-light',
                {
                  'is-loading ': isLoading,
                },
              )}
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          {searchedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleMovieAdd(searchedMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {searchedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={searchedMovie} />
        </div>
      )}
    </>
  );
};
