const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "process.env.GOOGLE_CALLBACK_URL"
        },

        async (accessToken, refreshToken, profile, done) => {

            try {

                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(
                        new Error("Google account email not found"),
                        null
                    );
                }


                let user = await User.findOne({
                    email
                });


                if (!user) {

                    user = await User.create({
                        name: profile.displayName,
                        email,
                        role: "user"
                    });

                }


                user = await User.findById(
                    user._id
                );


                done(null, user);


            } catch(err) {

                done(err, null);

            }

        }
    )
);


passport.serializeUser((user, done) => {
    done(null, user._id);
});


passport.deserializeUser(async (id, done) => {

    try {

        const user = await User.findById(id);

        done(null, user);


    } catch(err) {

        done(err, null);

    }

});


module.exports = passport;