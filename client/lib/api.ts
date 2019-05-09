import { stringify } from 'query-string';
import { Post } from 'types';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

class API {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  // Public methods
  submitPost(name: string, content: string) {
    return this.request<{ post: Post; paymentRequest: string; }>(
      'POST',
      '/posts',
      { name, content },
    );
  }

  getPosts() {
    return this.request<Post[]>('GET', '/posts');
  }

  getPost(id: number) {
    return this.request<Post>('GET', `/posts/${id}`);
  }

  // Internal fetch function. Makes a request to the server, and either returns
  // JSON parsed data from the request, or throws an error.
  protected request<R extends object>(
    method: ApiMethod,
    path: string,
    args?: object,
  ): Promise<R> {
    let body = null;
    let query = '';
    const headers = new Headers();
    headers.append('Accept', 'application/json');

    if (method === 'POST' || method === 'PUT') {
      body = JSON.stringify(args);
      headers.append('Content-Type', 'application/json');
    }
    else if (args !== undefined) {
      // TS Still thinks it might be undefined(?)
      query = `?${stringify(args as any)}`;
    }

    return fetch(this.url + path + query, {
      method,
      headers,
      body,
    })
    .then(async res => {
      if (!res.ok) {
        let errMsg;
        try {
          const errBody = await res.json();
          if (!errBody.error) throw new Error();
          errMsg = errBody.error;
        } catch(err) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        throw new Error(errMsg);
      }
      return res.json();
    })
    .then(res => res.data as R)
    .catch((err) => {
      console.error(`API error calling ${method} ${path}`, err);
      throw err;
    });
  }
}

// Export a default API that points at the API_PATH environment variable
export default new API(process.env.API_PATH as string);
