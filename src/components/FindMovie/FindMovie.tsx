import React, { useState } from 'react';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  handlerAdd: (newMovie: Movie) => void;
}

const baseImgUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({
  handlerAdd,
}) => {
  const [hasError, setHasError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (value: string) => {
    setSearchQuery(value);

    if (value) {
      setHasError(false);
    }
  };

  const handleFindMovie = () => {

  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(searchQuery).then(data => {
      if ('Error' in data) {
        setHasError(true);
      } else {
        const imgMovieUrl = data.Poster !== 'N/A'
          ? data.Poster
          : baseImgUrl;

        const newMovie: Movie = {
          title: data.Title,
          description: data.Plot,
          imgUrl: imgMovieUrl,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        };

        setSelectedMovie(newMovie);
      }
    })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
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
              value={searchQuery}
              onChange={(event) => handleQueryChange(event.currentTarget.value)}
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
              className={cn('button', 'is-light',
                { 'is-loading': isLoading })}
              onClick={handleFindMovie}
              disabled={!searchQuery}
            >
              {!selectedMovie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          {selectedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handlerAdd(selectedMovie);
                  setSelectedMovie(null);
                  setSearchQuery('');
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {selectedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={selectedMovie} />
        </div>
      )}
    </>
  );
};
