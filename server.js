const express = require('express');
const path = require('path');

// db connecetion
require('./db/mongoose');

const port = process.env.PORT || 3000;
const app = express();
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({ extended: true }));

// apply routers
app.use('/rumahsakit', require('./routers/rumahSakit'));
app.use('/rumahsakitpost', require('./routers/rumahSakitPost'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
