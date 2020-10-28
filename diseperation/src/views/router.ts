import * as express from "express";
import * as path from "path";

export default function router(): express.Router {
  const r = express.Router();

  const distRoot = path.join("vue", "dist");
  r.use("/", express.static(distRoot));
  r.get("/", (_req, res) => {
    res.sendfile(path.join(distRoot, "index.html"));
  });

  return r;
}
