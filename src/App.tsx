import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: data,
  };

  addNewMovie = (movie: Movie | null) => {
    const { movies } = this.state;

    if (movie && !movies.find(film => film.imdbId === movie.imdbId)) {
      this.setState(prevState => ({
        movies: [
          ...prevState.movies,
          movie,
        ],
      }));
    }
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie onAdd={this.addNewMovie} />
        </div>
      </div>
    );
  }
}
