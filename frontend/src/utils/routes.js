let HOST;
if (process.env.NODE_ENV === 'production') {
    HOST = 'https://ufokn-game.herokuapp.com'
} else {
    HOST = 'http://localhost:5000'
}

export default HOST