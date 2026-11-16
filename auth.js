import NextAuth from "next-auth";
import GooglePro from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        GooglePro({
            clientId: "369525330225-9k6c3sccbvdd6r8ilpojdu5nehgfj8jr.apps.googleusercontent.com",
            clientSecret: "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",
        })
    ],
    secret: "9cd9c54dd5e8ec15a4aa3d5261b021519bb9260340b1b95d74eb744caece394f",
    trustHost: true
});
