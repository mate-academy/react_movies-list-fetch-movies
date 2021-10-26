import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { promise } from '../../API/API';

type Props = {
  addMovieToList: (movie: Movie) => void,
  message: string,
  correctMessage: (newMessage: string) => void,
};

export const FindMovie: React.FC<Props> = ({
  addMovieToList,
  message,
  correctMessage,
}) => {
  const [value, setValue] = useState('');
  const [isFindMovie, setIsFindMovie] = useState(true);
  const [movie, setMovie] = useState<Movie>({} as Movie);

  const findMovie = () => {
    promise(value)
      .then((movieFromServer) => {
        if (movieFromServer.Response === 'False') {
          setIsFindMovie(false);
        } else {
          setValue('');
        }

        setMovie(movieFromServer);
      });
  };

  const inputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    correctMessage('');
    setIsFindMovie(true);
  };

  const isMovie = (movie.Response !== 'False' && movie.Response !== undefined);

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <p className="label">
            Movie title
          </p>

          <div className="control">
            <input
              onChange={inputValue}
              value={value}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={isFindMovie ? 'input' : 'input is-danger'}
            />
          </div>

          <p className="help is-danger">
            {
              isFindMovie || 'Can\'t find a movie with such a title'
            }
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={findMovie}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              onClick={() => addMovieToList(movie)}
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
            <p className="help is-danger">
              {
                message
              }
            </p>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {
          isMovie && <MovieCard movie={movie} />
        }
      </div>
    </>
  );
};
