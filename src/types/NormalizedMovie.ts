import { MovieData } from './MovieData';

export interface NormalizedMovie extends MovieData {
  imdbUrl: string;
}
