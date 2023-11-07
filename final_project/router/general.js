const express = require('express');
let books = require('./booksdb.js');
const public_users = express.Router();

module.exports = (users) => {
  const isValid = (username) => {
    return users.some((user) => user.username === username);
  };

  public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    if (isValid(username)) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    users.push({ username, password });
    return res.status(200).json({ message: 'Registration successful' });
  });

  // Original solution:
  // public_users.get('/', function (req, res) {
  //    res.send(JSON.stringify(books, null, 4));
  //  });
  public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
      resolve(books);
    })
      .then((books) => {
        res.send(JSON.stringify(books, null, 4));
      })
      .catch((error) => {
        res.status(500).json({ message: 'An error occurred' });
      });
  });

  // Original solution:
  // public_users.get('/isbn/:isbn', function (req, res) {
  //   const ISBN = req.params.isbn;
  //   res.send(books[ISBN]);
  // });
  public_users.get('/isbn/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    new Promise((resolve, reject) => {
      resolve(books[ISBN]);
    })
      .then((book) => {
        res.send(book);
      })
      .catch((error) => {
        res.status(500).json({ message: 'An error occurred' });
      });
  });

  // Original solution:
  // public_users.get('/author/:author', function (req, res) {
  //   let author = [];
  //   for (const [key, values] of Object.entries(books)) {
  //     const book = Object.entries(values);
  //     for (let i = 0; i < book.length; i++) {
  //       if (book[i][0] == 'author' && book[i][1] == req.params.author) {
  //         author.push(books[key]);
  //       }
  //     }
  //   }
  //  if (author.length == 0) {
  //    return res.status(300).json({ message: 'Author not found' });
  //  }
  //  res.send(author);
  // });

  public_users.get('/author/:author', function (req, res) {
    new Promise((resolve, reject) => {
      let author = [];
      for (const [key, values] of Object.entries(books)) {
        const book = Object.entries(values);
        for (let i = 0; i < book.length; i++) {
          if (book[i][0] == 'author' && book[i][1] == req.params.author) {
            author.push(books[key]);
          }
        }
      }
      resolve(author);
    })
      .then((author) => {
        if (author.length == 0) {
          return res.status(300).json({ message: 'Author not found' });
        }
        res.send(author);
      })
      .catch((error) => {
        res.status(500).json({ message: 'An error occurred' });
      });
  });

  // Original solution:
  // public_users.get('/title/:title', function (req, res) {
  //   let result = [];
  //   for (const [key, values] of Object.entries(books)) {
  //     const book = Object.entries(values);
  //    for (let i = 0; i < book.length; i++) {
  //      if (book[i][0] == 'title' && book[i][1] == req.params.title) {
  //        result.push(books[key]);
  //      }
  //    }
  //  }
  //  if (result.length == 0) {
  //    return res.status(300).json({ message: 'Title not found' });
  //  }
  //  res.send(result);
  // });

  public_users.get('/title/:title', function (req, res) {
    new Promise((resolve, reject) => {
      let result = [];
      for (const [key, values] of Object.entries(books)) {
        const book = Object.entries(values);
        for (let i = 0; i < book.length; i++) {
          if (book[i][0] == 'title' && book[i][1] == req.params.title) {
            result.push(books[key]);
          }
        }
      }
      resolve(result);
    })
      .then((result) => {
        if (result.length == 0) {
          return res.status(300).json({ message: 'Title not found' });
        }
        res.send(result);
      })
      .catch((error) => {
        res.status(500).json({ message: 'An error occurred' });
      });
  });

  public_users.get('/review/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews);
  });

  return public_users;
};
