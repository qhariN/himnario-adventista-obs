export const apiUrl = {
  hymn: 'https://himnario-adventista-api.herokuapp.com/hymn'
}

const Fetch = (endpoint: string) => {
  return fetch(endpoint)
    .then(response => response.json())
}

export default Fetch