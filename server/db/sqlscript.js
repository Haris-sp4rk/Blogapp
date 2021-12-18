const path = require('path');
const fs = require('fs');
const MYSQL_CONNECTOR = (require('./connectDB.js'));

const createAndInsert = async () => {
  const script = fs.readFileSync(path.join(__dirname, './ddl.sql')).toString();
  try {
    const result = await MYSQL_CONNECTOR.connection.query(script);
    console.log('DDL Created Successfully for MySQL');
    console.log(result);
  } catch (error) {
    console.log(`DDL Creation query not executed successfully for MySQL because --> ${error.message}`);
  }};
  module.exports.createAndInsert = createAndInsert;