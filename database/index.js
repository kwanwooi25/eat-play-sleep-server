const db = require('knex')({
  client: 'pg',
  connection: {
    host : process.env.DB_URL,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
  }
});

const dropTableIfExists = tableName => {
  db.schema.hasTable(tableName).then(exists => {
    if (exists) {
      db.schema
        .dropTable(tableName)
        .then(() => { console.log(`TABLE DROPPED: ${tableName}`)})
        .catch(console.log)
    }
  })
}

// dropTableIfExists('users');
// dropTableIfExists('login');
// dropTableIfExists('babies');

/** Create 'users' table */
db.schema.hasTable('users').then(exists => {
  if (!exists) {
    db.schema.createTable('users', table => {
        table.string('id').primary().unique().notNullable();
        table.string('provider').notNullable();
        table.string('email');
        table.string('google_id');
        table.string('facebook_id');
        table.string('kakao_id');
        table.string('naver_id');
    })
      .then(() => { console.log('TABLE CREATED: "users"') })
      .catch(console.log)
  }
});

/** Create 'login' table */
db.schema.hasTable('login').then(exists => {
  if (!exists) {
    db.schema.createTable('login', table => {
      table.string('id').primary().unique().notNullable();
      table.string('password').notNullable();
    })
      .then(() => { console.log('TABLE CREATED: "login"') })
      .catch(console.log)
  }
});

/** Create 'babies' table */
db.schema.hasTable('babies').then(exists => {
  if (!exists) {
    db.schema.createTable('babies', table => {
      table.string('id').primary().unique().notNullable();
      table.string('name').notNullable();
      table.string('gender').notNullable();
      table.date('birthday').notNullable();
      table.jsonb('guardians');
      table.jsonb('activities');
    })
      .then(() => { console.log('TABLE CREATED: "babies"') })
      .catch(console.log)
  }
});

module.exports = db;