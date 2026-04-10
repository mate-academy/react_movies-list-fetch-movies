type NoData = 'N/A';

export interface MovieData {
  Poster: NoData | string;
  Title: string;
  Plot: string;
  imdbID: string;
}

export function isNoData(value: string): value is NoData {
  return value === 'N/A';
}
