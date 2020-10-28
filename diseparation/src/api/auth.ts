import * as session from "express-session";
import * as passport from "passport";
import * as express from "express";
import Status from "../constants/status";
import { Strategy } from "passport-discord";
import { app, log } from "..";
import config from "../config";

interface AuthUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  provider: string;
  accessToken: string;
  fetchedAt: Date;
}

interface AuthRequest extends express.Request {
  user: AuthUser;
  isAuthenticated(): boolean;
}

export default function (): express.Router {
  const r = express.Router();

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  const scope = ["identify" /* "relationships.read" */];

  passport.use(
    new Strategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callback,
        scope,
      },
      (_access, _refresh, profile, done) => process.nextTick(() => done(null, profile))
    )
  );

  app.use(
    session({
      secret: config.cookieSecret,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  r.get("/login", passport.authenticate("discord", { scope }));
  r.get(
    "/callback",
    passport.authenticate("discord", {
      failureRedirect: "/",
      scope,
    }),
    (req: AuthRequest, res) => {
      log.info(req.user.username + ": authenticated");
      res.redirect("/api/v1/auth/test");
    }
  );
  r.get("/test", checkAuth, (req: AuthRequest, res) => res.json(req.user));

  return r;
}

function checkAuth(req: AuthRequest, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated()) return next();
  res.sendStatus(Status.Forbidden);
}
