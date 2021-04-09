import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
    newMovie: null,
  };

  componentDidUpdate(_, prevState) {
    if (prevState.newMovie !== this.state.newMovie) {
      this.updateMovie();
    }
  }

  updateMovie = () => {
    const { newMovie, movies } = this.state;

    const revise = movies.find(movie => movie.imdbId === newMovie.imdbId);

    if (!revise) {
      this.setState(prevState => ({
        movies: [...prevState.movies, prevState.newMovie],
      }));
    }
  }

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addNewMovie={(newMovie) => {
            this.setState({
              newMovie,
            });
          }}
          />
        </div>
      </div>
    );
  }
}
