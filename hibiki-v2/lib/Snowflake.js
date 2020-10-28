/*
  Hibiki Snowflake Function

  This is used to generate IDs in things such as
  strikes, reputation points, and reminders.
*/

module.exports = {
  // Snowflake function
  snowflake: function() {
    // Creates the snowflake
    return BigInt(parseInt(Date.now() / 15)).toString(36);
  },
};
