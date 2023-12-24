export const cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODY4MDQyM2MwZWI0NzdmNzdmOWYzMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMzQwNzEyMn0.WsNJ0SCaH72jxh1BBuQFH5i0ePt31XqG5kqKgEHUJwM';
    return token;
};
