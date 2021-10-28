import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
  };

  addTolist = (movie: Movie) => {
    if (!this.state.movies.find((movie1) => movie1.imdbID === movie.imdbID)) {
      this.setState(prevState => ({ movies: [...prevState.movies, movie] }));
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
          <FindMovie addToList={this.addTolist} />
        </div>
      </div>
    );
  }
}
