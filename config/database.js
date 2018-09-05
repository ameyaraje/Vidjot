if (process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: 'mongodb://ameyaraje:ameya123@ds119151.mlab.com:19151/vidjotdb-prod'};
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'};
}