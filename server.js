import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import axios from 'axios';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv'
const environment = dotenv.config();
const env = environment.parsed;
// console.log(environment.parsed.SECRET_KEY);

const saltRounds = 10;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}
const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);

mongoose.connect(env.DB, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', err => console.error(err));
db.once('open', () => console.log("Connected to DB"));

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
    },
    room: {
        type: String,
        required: true,
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const roomModel = mongoose.model("Room", roomSchema);
const chatModel = mongoose.model("Chat", chatSchema);
const userModel = mongoose.model("User", userSchema);

app.get('/', async (req, res) => {
    try {
        const rooms = await roomModel.find({ name: "nik room" });
        res.json(rooms);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/createroom', async (req, res) => {
    let body = req.body;

    let rooms = await roomModel.find();

    if (rooms.find(element => element.name == req.body?.name)) {
        res.json({ msg: "Room already exists" }).status(200);
    } else {
        const room = new roomModel({
            name: req.body.name,
        });
        const newroom = await room.save();
        res.json({ msg: "Successfully created room." }).status(200);
    }
});

app.post('/login', async (req, res) => {
    let body = req.body;
    const user = await userModel.findOne({ name: body.name });

    if (user != null) {
        bcrypt.compare(body.password, user.password, function (err, result) {
            if (err) res.json({ msg: "Error logging in." }).status(500);
            if(result){
                res.json({ msg: "Success", success: true }).status(200);
            }else{
                res.json({msg: "Invalid credentials", success: false}).status(200);
            }
        });
    } else {
        res.json({ msg: 'User does not exist.', success: false }).status(200);
    }
});

app.post('/signup', async (req, res) => {
    let body = req.body;
    const user = await userModel.findOne({ name: body.name });

    if (user == null) {
        bcrypt.hash(body.password, saltRounds, async function (err, hash) {
            if(err) res.json({ msg: "Error creating account." }).status(500);

            const user = new userModel({
                name: body.name,
                password: hash,
            });
            const newUser = await user.save();

            res.json({msg: "Successfully created account", success: true}).status(200);
        });
    } else {
        res.json({ msg: 'User already exists.', success: false }).status(200);
    }
});


app.get('/chatlist', async function (req, res) {
    const Rooms = await roomModel.find();
    res.json(Rooms);
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', async (client) => {
    client.on('event', data => {
        console.log(data);
    });

    client.on('disconnect', () => { /* … */ });

    client.on('ping', () => {
        console.log("PONG");
        client.emit('pong');
    });

    client.on('message', (data) => {
        if (data?.room) {
            if (data?.content != '' && data?.name != '') {
                filterMessage(data);
            }
        }

    });

    client.on('join', async (data) => {
        client.join(data.room);
        const chats = await chatModel.find({ room: data.room });
        client.emit('loadMessages', chats);
    });
});

const filterMessage = async (data) => {
    //https://www.purgomalum.com/service/json?text=this is some test input&add=input&fill_char=_
    const options = {
        method: 'GET',
        url: 'https://community-purgomalum.p.rapidapi.com/json',
        params: { text: data.content },
        headers: {
            'X-RapidAPI-Key': env.API_KEY,
            'X-RapidAPI-Host': 'community-purgomalum.p.rapidapi.com'
        }
    };

    axios.request(options).then(async function (response) {
        data.content = response.data.result;
        const chat = new chatModel({
            name: data.name,
            content: data.content,
            timestamp: data.time,
            room: data.room,
        });
        const newroom = await chat.save();
        io.to(data.room).emit('newMessage', data);
    }).catch(function (error) {
        console.error(error);
    });
}

server.listen(env.PORT);