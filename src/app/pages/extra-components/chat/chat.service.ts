import { Injectable } from '@angular/core';

import { botReplies, gifsLinks, imageLinks } from './bot-replies';
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

  loadBotReplies() {
    return botReplies;
  }

  reply(message: string) {
    const botReply: any =  this.loadBotReplies()
      .find((reply: any) => message.search(reply.regExp) !== -1);

    if (botReply.reply.type === 'quote') {
      botReply.reply.quote = message;
    }

    if (botReply.type === 'gif') {
      botReply.reply.files[0].url = gifsLinks[Math.floor(Math.random() * gifsLinks.length)];
    }

    if (botReply.type === 'pic') {
      botReply.reply.files[0].url = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    }

    if (botReply.type === 'group') {
      botReply.reply.files[1].url = gifsLinks[Math.floor(Math.random() * gifsLinks.length)];
      botReply.reply.files[2].url = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    }

    botReply.reply.text = botReply.answerArray[Math.floor(Math.random() * botReply.answerArray.length)];
    return { ...botReply.reply };
  }
}
