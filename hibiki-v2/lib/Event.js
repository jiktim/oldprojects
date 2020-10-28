/*
  Hibiki Event Constructor

  This is the Event constructor
  that all of Hibiki's events use.
*/

class Event {
  // Sets the constructor
  constructor(bot, db, event, params) {
    this.bot = bot;
    this.db = db;
    this.id = event;
    this.name = params.name;
  }
}

module.exports = Event;
