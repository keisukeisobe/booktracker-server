const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 7)
  }));
  return db.into('users').insert(preppedUsers)
    .then( () => 
      db.raw('SELECT setval(\'users_id_seq\', ?)', [users[users.length-1].id])
    );
}

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      email: 'info1@email.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      username: 'test-user-2',
      email: 'info2@email.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      username: 'test-user-3',
      email: 'info3@email.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      username: 'test-user-4',
      email: 'info4@email.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];
}

function makeBooksArray() {
  return [
    {
      id: 1,
      title: 'The Final Empire',
      author: 'Brandon Sanderson',
      description: 'Mistborn Book 1',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      title: 'The Well of Ascension',
      author: 'Brandon Sanderson',
      description: 'Mistborn Book 2',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      title: 'The Hero of Ages',
      author: 'Brandon Sanderson',
      description: 'Mistborn Book 3',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      title: 'A Way of Kings',
      author: 'Brandon Sanderson',
      description: 'The Stormlight Archives Book 1',
      date_created: '2029-01-22T16:28:32.615Z',
    }
  ];
}

function makeProgressArray() {
  return [
    {
      id: 1,
      book_id: 1,
      user_id: 1,
      percent: 100,
      reading_status: 'completed'
    },
    {
      id: 2,
      book_id: 2,
      user_id: 1,
      percent: 50,
      reading_status: 'in progress'
    },
    {
      id: 3,
      book_id: 3,
      user_id: 1,
      percent: 75,
      reading_status: 'in progress'
    },
    {
      id: 4,
      book_id: 4,
      user_id: 1,
      percent: 25,
      reading_status: 'in progress'
    },
  ];
}

function makeRatingsArray(){
  return [
    {
      id: 1,
      content: 'great',
      user_id: 1,
      book_id: 1,
      rating: 5
    },
    {
      id: 2,
      content: 'amazing',
      user_id: 1,
      book_id: 2,
      rating: 5
    },
    {
      id: 3,
      content: 'incredible',
      user_id: 1,
      book_id: 3,
      rating: 5
    },
    {
      id: 4,
      content: 'wow',
      user_id: 1,
      book_id: 4,
      rating: 5
    }
  ];
}

function makeExpectedBook(books, progress){
  const book = books.find(book=>book.id === progress.book_id);
  return {
    id: book.id,
    title: book.title,
    description: book.description,
    date_created: book.date_created
  };
}

function makeMaliciousBook() {
  const maliciousBook = {
    id: 999,
    date_created: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    description: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
  };
  const expectedBook = {
    id: 999,
    date_created: maliciousBook.date_created,
    title: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    description: 'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
  };
  return {
    maliciousBook,
    expectedBook
  };
}

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testBooks = makeBooksArray();
  const testProgress = makeProgressArray();
  const testRatings = makeRatingsArray();
  return {testUsers, testBooks, testProgress, testRatings};
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users,
      ratings,
      progress,
      genres,
      books,
      authors
      RESTART IDENTITY CASCADE`
  );
}

function seedTables(db, users, books, progress, ratings){
  return db.transaction(async trx => {
    await seedUsers(db, users);
    await trx.into('books').insert(books);
    await trx.raw('SELECT setval(\'books_id_seq\', ?)', [books[books.length-1].id]);
    if (progress.length > 0){
      await trx.into('progress').insert(progress);
      await trx.raw('SELECT setval(\'progress_id_seq\', ?)', [progress[progress.length-1].id]);
    }
    if(ratings.length > 0){
      await trx.into('ratings').insert(ratings);
      await trx.raw('SELECT setval(\'ratings_id_seq\', ?)', [ratings[ratings.length-1].id]);
    }
  });
}

function seedMaliciousBook(db, user, book){
  return seedUsers(db, [user])
    .then( () => db.into('books').insert(book));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({user_id: user.id}, secret, {subject: user.username, algorithm: 'HS256'});
  return `Bearer ${token}`;
}

module.exports = {
  seedUsers,
  makeUsersArray,
  makeBooksArray,
  makeProgressArray,
  makeExpectedBook,
  makeMaliciousBook,
  makeFixtures,
  cleanTables,
  seedTables,
  seedMaliciousBook,
  makeAuthHeader,
  makeRatingsArray,
};