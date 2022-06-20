const request = (title: string) => {
  return fetch(`https://www.omdbapi.com/?apikey=92c0b48e&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

export const getMovie = (title: string) => {
  return request(title);
};
