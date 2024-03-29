const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database Connected');
}).catch((e) => {
    console.log(e.message);
});