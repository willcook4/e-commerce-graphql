const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db').default;

const server = createServer();

// Use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// Use express middleware to populate current user
// Decode the JWT so that we can get the current user
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if(token) {
    console.log('TOKEN TOKEN: ', token)
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the req for further requests to access
    req.userId = userId;
    console.log('userId: ',userId) 
  }

  next();
});

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
}, (deets) => {
  console.log(`Server is now running on port http://localhost:${deets.port}`);
});
