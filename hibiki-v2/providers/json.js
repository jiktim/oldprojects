const fs = require("fs");
module.exports.DBPATH = `${process.cwd()}/db.json`;
let db = require(module.exports.DBPATH);
let lut = [];
for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }

function uuid() {
  var d0 = Math.random() * 0xffffffff | 0;
  var d1 = Math.random() * 0xffffffff | 0;
  var d2 = Math.random() * 0xffffffff | 0;
  var d3 = Math.random() * 0xffffffff | 0;
  return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
    lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
    lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
    lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}

function update(table, id) {
  return (newd) => {

  }
}

function insert(table) {
  return (newd) => {
    if (!newd || !(newd instanceof Object)) return Error("invalid")
    if (!newd.id) newd.id = uuid();
    db.push(newd);
  }
}

function get(table) {
  return (id) => {
    let obj = db[table].find(d => d.id == id);
    if (!obj) return Error("not found");
    return Object.assign(obj, { update: update(table, obj.id) });
  }
}

function forEach(table) {
  return (callback) => {
    return db[table].forEach(callback);
  };
};

function filter(table) {
  return (callback) => {
    return db[table].filter(callback);
  };
};

function find(table) {
  return (callback) => {
    return db[table].find(callback);
  };
};

module.exports.table = (t) => {
  return { forEach: forEach(t), filter: filter(t), find: find(t), get: get(t), insert: insert(t) }
};

// Initalizes the json file
module.exports.init = () => {}
