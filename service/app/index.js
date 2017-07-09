const Koa = require('koa');
const session = require('koa-session');
var views = require('koa-views');
const CSRF = require ("koa-csrf");
var bodyParser = require('koa-bodyparser');
const myRouter=require("./controller/router/index").myRouter;

const app = new Koa();
app.keys = ['a'];

app.listen(3000);

app.use(views(__dirname + '/views', {
  map: {html: 'jade'},
  extension: 'jade' 
}));

app.use(session({
   key: 'otimeSessionId', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false,
},app));

app.use(new CSRF({
  invalidSessionSecretMessage: 'Invalid session secret',
  invalidSessionSecretStatusCode: 405,
  invalidTokenMessage: 'Invalid CSRF token!!!',
  invalidTokenStatusCode: 406,
  excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
  disableQuery: false
}));

app.use(bodyParser({
  extendTypes: {
    json: ['application/x-javascript'] // will parse application/x-javascript type body as a JSON string 
  }
}));

//app.use(myRouter());
myRouter(app);


