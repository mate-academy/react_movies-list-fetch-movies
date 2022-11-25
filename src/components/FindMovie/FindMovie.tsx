import React, { useState } from 'react';
import './FindMovie.scss';
// import { useState } from 'react';
// import classNames from 'classnames';
// import { Movie } from '../../types/Movie';
type Props = {
  findMovie:any;
};

export const FindMovie: React.FC<Props> = ({ findMovie }) => {
  const [input, setInput] = useState('');

  const handleChange = (event:any) => {
    setInput(event.target.value);
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
              value={input}
              onChange={handleChange}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            {!input
              ? (
                <button
                  data-cy="searchButton"
                  type="submit"
                  className="button is-light"
                  disabled
                  // className={classNames('button is-light', {
                  //   disabled: !input,
                  // })}
                >
                  Find a movie
                </button>
              ) : (
                <button
                  data-cy="searchButton"
                  type="submit"
                  className="button is-light"
                  onClick={() => findMovie(input)}
                >
                  Find a movie
                </button>
              )}

          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {/* <MovieCard movie={movie} /> */}
      </div>
    </>
  );
};
