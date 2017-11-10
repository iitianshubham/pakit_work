const express = require('express')
const path = require('path')
const cors = require('cors')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()

app.use(express.static(path.join(__dirname, './client')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())
app.use(logger('dev'));

/* Send index.html (entry point for angularjs setup) */
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'))
})

/* Error handling */
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500).send('Error!');
});

app.listen(3000)
