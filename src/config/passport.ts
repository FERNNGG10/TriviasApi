import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import prisma from "@config/database";
import { User } from "src/generated/prisma";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        include: {
          role: true, // Incluir el rol del usuario
        },
      });
      if (user) {
        return done(null, user as User);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: {
            email: profile.emails?.[0]?.value || "",
            provider: "google",
          },
        });
        if (user) {
          if (user.status === false) {
            return done(null, false, { message: "User is inactive" });
          }
          if (!user.provider || !user.providerId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                provider: "google",
                providerId: profile.id,
              },
            });
          }
          return done(null, user as User);
        } else {
          const newUser = await prisma.user.create({
            data: {
              name:
                profile.displayName ||
                profile.emails?.[0]?.value ||
                "Google User",
              email: profile.emails?.[0]?.value!,
              provider: "google",
              providerId: profile.id,
              roleId: 2,
              password: null,
            },
          });
          return done(null, newUser as User);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
