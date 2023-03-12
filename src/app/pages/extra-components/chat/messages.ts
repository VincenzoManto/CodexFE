export const messages = [
  {
    text: 'Hello, how are you? This should be a very long message so that we can test how it fit into the screen.',
    reply: false,
    date: new Date(),
    user: {
      name: 'NQL',
      avatar: 'https://i.gifer.com/no.gif',
    },
  },
  {
    text: 'Hello, how are you? This should be a very long message so that we can test how it fit into the screen.',
    reply: true,
    date: new Date(),
    user: {
      name: 'NQL',
      avatar: 'https://i.gifer.com/no.gif',
    },
  },
  {
    text: 'Hello, how are you?',
    reply: false,
    date: new Date(),
    user: {
      name: 'NQL',
      avatar: '',
    },
  },
  {
    text: 'Hey looks at that pic I just found!',
    reply: false,
    date: new Date(),
    type: 'file',
    files: [
      {
        url: 'https://i.gifer.com/no.gif',
        type: 'image/jpeg',
        icon: false,
      },
    ],
    user: {
      name: 'NQL',
      avatar: '',
    },
  },
  {
    text: 'What do you mean by that?',
    reply: false,
    date: new Date(),
    type: 'quote',
    quote: 'Hello, how are you? This should be a very long message so that we can test how it fit into the screen.',
    user: {
      name: 'NQL',
      avatar: '',
    },
  },
  {
    text: 'Give me the profit of seasons A10 over the years',
    reply: true,
    date: new Date(),
    type: 'text',
    user: {
      name: 'NQL',
      avatar: '',
    },
  },
  {
    text: 'Here what i found',
    reply: false,
    date: new Date(),
    type: 'chart-a',
    latitude: 40.714728,
    longitude: -73.998672,
    user: {
      name: 'NQL',
      avatar: '',
    },
  },
  {
    text: 'What is the daily income of Bitcoin?',
    reply: true,
    date: new Date(),
    type: 'text',
    user: {
      name: 'NQL',
      avatar: '',
    },
  },
  {
    text: 'Here what i found',
    reply: false,
    date: new Date(),
    type: 'chart-e',
    latitude: 40.714728,
    longitude: -73.998672,
    user: {
      name: 'NQL',
      avatar: '',
    },
  },
];
