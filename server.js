const dotenv = require("dotenv");                                                                                                                           
const app = require("./app");                                                                                                                               
dotenv.config();

const connectDB = require("./database/connect");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    console.log("Stack:", err.stack);
    process.exit(1);
});

// connection to the database
connectDB();

// Start the server
const server = app.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    console.log("Stack:", err.stack);
    
    server.close(() => {
        process.exit(1);
    });
});