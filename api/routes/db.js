import express from 'express';
import sqlite3 from 'sqlite3';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

const { Router } = require('express')
const db = new sqlite3.Database('db.sqlite')

db.serialize(function () {
  db.run(`CREATE TABLE if not exists users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`);
  /* var stmt = db.prepare('INSERT INTO lorem VALUES (?)')

  for (var i = 0; i < 10; i++) {
      stmt.run('Ipsum ' + i)
  }

  stmt.finalize() */

  /* db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
      console.log(row.id + ': ' + row.info)
  }) */
  const router = Router()

  router.use(express.json())


  /* router.post('/db', function (req, res, next) {
      let sql = `INSERT INTO (users) VALUES (?,?,?,?)`;
      db.run(insert, ["admin", "jhony.jss@gmail.com", md5("123456")])
  }) */
  //INSERT USERS
  router.post('/db/user', function (req, res, next) {
    console.log(req.body);
    db.run('INSERT INTO users(name, email, password) VALUES(?, ?, ?)',
      [req.body.name, req.body.email, md5(req.body.password)], (err) => {
        if (err) {
          return console.log(err.message);
        }
        return res.json({ "message": "User Created" })
      })
  })

  router.get('/db/:id', function (req, res, next) {
    let id = req.params.id
    let sql = `SELECT * FROM users where id = ${id}`

    db.get(sql, function (err, row) {
      console.log(row.id + ': ' + row.info)
      res.json(row)
    })
  })

  router.post('/auth/login', function (req, res, next) {
    if (req.body.password != '' && req.body.email != '') {
      let sql = `SELECT * FROM users where email = '${req.body.email}' and password= '${md5(req.body.password)}'`
      db.get(sql, function (err, row) {
        if (err || typeof row == "undefined") {
          res.status(401);
          return res.end();
        }
        const payload = row;
        const token = jwt.sign(payload, 'uploaddojhony');
        req.session.userId = row.id
        res.cookie('token', token);

        return res.json({ token: token, data: row });

      })
    }
  })

  router.post("/auth/logout", (req, res, next) => {
    res.clearCookie("token");
    return next()
  })

  router.get('/auth/user', (req, res, next) => {
    if (typeof req.session.userId == 'undefined') {
      jwt.destroy(res.cookie('token'))
    }
    let sql = `SELECT id, name, email FROM users where id = '${req.session.userId}'`
    db.get(sql, function (err, row) {
      if (err) {
        req.redirect('/')
      }
      return res.json({ data: row });
    })
  })

  module.exports = router
})