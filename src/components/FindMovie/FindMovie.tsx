import { FC, memo, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  onAdd: (movie: Movie) => void,
}

export const FindMovie: FC<Props> = memo(
  ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleGetMovie = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      event.preventDefault();
      setIsLoading(true);

      getMovie(title)
        .then(response => {
          if ('Error' in response) {
            throw new Error('error');
          }

          const {
            Poster,
            Title,
            Plot,
            imdbID,
          } = response as MovieData;

          const posterForMovie = Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: posterForMovie,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => setIsLoading(false));
    };

    // const handleMovieAdding = () => {
    //   onAdd((movies) => {
    //     if (!movie) {
    //       return movies;
    //     }

    //     const movieToAdd = {
    //       ...movie,
    //     };

    //     setTitle('');
    //     setMovie(null);

    //     const isMovieAdded = movies.some((film => (
    //       film.imdbId === movie.imdbId
    //     )));

    //     if (isMovieAdded) {
    //       return movies;
    //     }

    //     return [
    //       ...movies,
    //       movieToAdd,
    //     ];
    //   });
    // };

    const handleMovieAdding = (movieToAdd: Movie) => {
      onAdd(movieToAdd);

      setTitle('');
      setMovie(null);
    };

    const handleInputOfData = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.currentTarget.value);
      setError(false);
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
                value={title}
                onChange={handleInputOfData}
              />
            </div>

            {
              error && (
                <p className="help is-danger" data-cy="errorMessage">
                  Can&apos;t find a movie with such a title
                </p>
              )
            }

          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                data-cy="searchButton"
                type="submit"
                className={`button is-light ${isLoading && 'is-loading'}`}
                disabled={!title}
                onClick={handleGetMovie}
              >
                {movie ? 'Search Again' : 'Find a movie'}
              </button>
            </div>

            <div className="control">
              {
                movie && (
                  <button
                    data-cy="addButton"
                    type="button"
                    className="button is-primary"
                    onClick={() => handleMovieAdding(movie)}
                  >
                    Add to the list
                  </button>
                )
              }
            </div>
          </div>
        </form>

        {
          movie && (
            <div className="container" data-cy="previewContainer">
              <h2 className="title">Preview</h2>
              <MovieCard movie={movie} />
            </div>
          )
        }
      </>
    );
  },
);
