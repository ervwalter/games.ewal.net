import jsonFetch, {retriers} from 'json-fetch';

function retry(response:any) {
  return retriers.isNetworkError(response) || retriers.is5xx(response);
}

const options = {
  shouldRetry: retry,
  retry: {
    retries: 3
  }
}

export default class DataProvider {
  public async fetch(url: string) {
    let response = await jsonFetch(url, options);
    return response.body;
  }
}