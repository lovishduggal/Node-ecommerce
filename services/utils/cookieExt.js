export const cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWEwYWZhZTk5YTgxNTAxOTUwZjU2YyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA0NTk1NjM5fQ.uVqVzoEEYjEukz6haU5W_AfotrHhl22r1P6rn8ri8tw';
    return token;
};
