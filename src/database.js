const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/stock-db-app', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db => console.log('Connected to MongoDB'))
    .catch(err => console.log('Ha ocurrido un error' + err));