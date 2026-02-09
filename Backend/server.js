const app = require('./src/app');
const connectDB = async () => {
    // We already have connectDB in src/config/db.js
};
const connect = require('./src/config/db');

// Connect to Database
connect();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
