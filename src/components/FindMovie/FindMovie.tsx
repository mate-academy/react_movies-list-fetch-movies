import { useState, useEffect } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[],
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAddMovie = () => {
    const hasMovie = movies.some(oldMovie => oldMovie.title === movie?.title);

    if (!hasMovie && movie) {
      setMovies([...movies, movie]);
    }

    setMovie(null);
    setTitle('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(title)
      .then(response => {
        if ('Response' in response && response.Response === 'False') {
          setError('Can\'t find a movie with such a title');
        } else if ('Title' in response) {
          setError(null);

          const foundMovie: Movie = {
            title: response.Title,
            description: response.Plot,
            imgUrl: (response.Poster && response.Poster !== 'N/A')
              ? response.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          };

          setMovie(foundMovie);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setError('');
  }, [title]);

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
              value={title}
              placeholder="Enter a title to search"
              className="input"
              onChange={handleTitleChange}
            />
          </div>

          {(!isLoading && error) && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={title.length < 1}
            >
              {(!movie) ? (
                <p>Find a movie</p>
              ) : (
                <p>Search again</p>
              )}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {(movie && !isLoading) && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
