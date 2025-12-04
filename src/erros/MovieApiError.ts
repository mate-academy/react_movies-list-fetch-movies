import { ResponseError } from '../types/ReponseError';

export class MovieApiError extends Error implements ResponseError {
  Response: 'False';

  Error: string;

  constructor(message: string) {
    super(message);
    this.Error = message;
    this.Response = 'False';
  }
}
