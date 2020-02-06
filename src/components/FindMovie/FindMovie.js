import React from 'react';
import './FindMovie.scss';

export class FindMovie extends React.Component {
  state = {};

  render() {
    return (
      <form className="find-movie">
        <div className="field">
          <label htmlFor="movie-title" className="label">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>

          <p className="help is-danger">
            Movie searchWord not found
          </p>
        </div>

        <div className="field is-grouped">
          <p className="control">
            <button
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </p>

          <p className="control">
            <button
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </p>
        </div>
      </form>
    );
  }
}
