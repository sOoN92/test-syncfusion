import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MySerService {
  http = inject(HttpClient);

  // JSON.stringify({
  //   title: 'foo',
  //   body: 'bar',
  //   userId: 1,
  // }

  add(body: any) {
    return this.http.post('https://jsonplaceholder.typicode.com/posts', {
      body,
    });
  }

  getAll() {
    return this.http.get('https://jsonplaceholder.typicode.com/posts').pipe(
      map((res: any) => {
        return res.map((r: any) => ({ text: r.title, value: r.title }));
      })
    );
  }
}
