import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import CircularJSON from 'circular-json';

@Injectable()
export class ChatService {

  constructor(
    private http: HttpClient,
  ) {

  }


  loadMessages() {
    return JSON.parse(localStorage.getItem('messages') || '[]');
  }

  saveMessages(messages) {
    localStorage.setItem('messages', CircularJSON.stringify(messages));
  }

  toJSON(arr: Array<any>) {
    const arrStrings = [];
    for (const obj of arr) {
      arrStrings.push(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'function') {
          return value.toString();
        } else {
          return value;
        }
      }));
    }
    return `[${arrStrings.join(',')}]`;
  }
}
