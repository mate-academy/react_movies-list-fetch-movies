const url = 'https://www.omdbapi.com/?apikey=df921301&';

export const request = (title: string) => {
  return fetch(`${url}${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
};
