const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

module.exports = (users) => {
  const authenticatedUser = (username, password) => {
    return users.some(
      (user) => user.username === username && user.password === password
    );
  };

  regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    if (!authenticatedUser(username, password)) {
      return res.status(403).json({ message: 'Invalid username or password' });
    }

    const accessToken = jwt.sign({ username }, 'access');
    req.session.authorization = { accessToken };

    return res.status(200).json({ message: 'Login successful' });
  });

  regd_users.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    const token = req.session.authorization.accessToken;
    const decoded = jwt.verify(token, 'access');
    const username = decoded.username;

    if (books[isbn]) {
      let book = books[isbn];
      book.reviews[username] = review;
      return res.status(200).send(`Review successfully posted by ${username}`);
    } else {
      return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
  });

  regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    const token = req.session.authorization.accessToken;
    const decoded = jwt.verify(token, 'access');
    const username = decoded.username;

    if (books[isbn]) {
      let book = books[isbn];
      if (book.reviews[username]) {
        delete book.reviews[username];
        return res
          .status(200)
          .send(`Review successfully deleted by ${username}`);
      } else {
        return res
          .status(404)
          .json({ message: `No review by ${username} for ISBN ${isbn}` });
      }
    } else {
      return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
  });

  return regd_users;
};
