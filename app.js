var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var senha = require('./routes/recuperaSenha');
var arquivos = require('./routes/produtos')
var pagamentos = require('./routes/pagamento')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'routes')));
app.use('/javascripts', express.static(__dirname + '/public/javascripts'));

const mediawere = require('./routes/authMiddleware')

app.use(session({
  secret: "minhaSenhaSuperBemGuardada",
  resave:false,
  saveUninitialized:true,
  cookie:{secure:false} // Em produção, defina secure: true
}));

app.use('/recuperaSenha',senha);
app.use('/login',loginRouter);


app.use(mediawere);
app.use('/',indexRouter);
app.use('/users', usersRouter);
app.use('/produtos',arquivos);
app.use('/pagamento',pagamentos);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Manipulador de erros
app.use(function(err, req, res, next) {
  // Define variáveis locais, fornecendo apenas o erro em ambiente de desenvolvimento
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderiza a página de erro
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
