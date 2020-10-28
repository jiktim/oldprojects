import * as mongo from "mongodb";
import config from "../config";

export let database: mongo.Db;
mongo
  .connect(config.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((mg) => (database = mg.db("diseparation")));
