const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const handlebars = require('express-handlebars');
const { Client } = require('pg');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const dbClient = new Client({
    user: "jiwon_ha", 
    host: "localhost",
    database: "choconomy", 
    password: "Hajiwon97", 
    port: 5432
});
dbClient.connect();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// req.body와 POST 요청을 해석하기 위한 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (request, response) => {  // 메인 화면
    response.render("home");
});

app.get("/character", async (request, response) => {
    response.render("character");
});

app.post("/room/:room_no/start_game", async (request, response) => {  // 캐릭터 설정
    try {
        const { room_no, name } = request.body;
        const insert_char_info = `INSERT INTO characters (room_no, name, age, money, debt) VALUES ($1, $2, 20, 4500000, 50000);`;
        
        await dbClient.query(insert_char_info, [room_no, name]);

        const select_age_query = `SELECT age FROM characters WHERE room_no = $1 AND name = $2;`;
        const select_money_query = `SELECT money FROM characters WHERE room_no = $1 AND name = $2;`;
        
        const age_rows = await dbClient.query(select_age_query, [room_no, name]);
        const money_rows = await dbClient.query(select_money_query, [room_no, name]);
        
        const char_age = age_rows.rows[0].age;  // Retrieve the age value
        const char_money = money_rows.rows[0].money;  // Retrieve the money value

        getOlder(parseInt(char_age), room_no);  // 각 방마다 캐릭터들이 나이를 먹는다.
        sendAgeUpdate(room_no, char_age);
        
        response.render("play", { name: name, age: char_age, money: char_money });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal server error starting game" });
    }
});


// 값 변경
function getOlder(new_age, room_no) {  // 나이 먹는 함수
    // new_age starts from 20;
    let minutes_passed = 0;
    
    const updateInterval = setInterval(() => {
        new_age += 1;
        minutes_passed += 2;

        if (minutes_passed <= 90 && new_age <= 65) {
            const updateQuery = `UPDATE characters SET age = $1 WHERE room_no = $2`;
            dbClient.query(updateQuery, [new_age, room_no]);

            sendAgeUpdate(room_no, new_age);
        }
        else {  // minutes_passed > 90 && new_age > 65
            clearInterval(updateInterval);
            console.log('게임 시간이 모두 초과되었습니다. 65세입니다.');  // 새로고침을 하면 같은 데이터가 테이블에 추가되는 오류 존재
        }
    }, 2 * 60 * 1000);
}
function sendAgeUpdate(room_no, age) {
    const data = JSON.stringify({ room_no, age });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

function loseMoney(new_money, debt, room_no) {
    let minutes_passed = 0;

    const updateInterval = setInterval(() => {
        // 
        minutes_passed += 2;

        if (minutes_passed < 90) {
            const updateQuery = `UPDATE characters SET money = $1 WHERE room_no = $2`;

            dbClient.query(updateQuery, [new_money, room_no]);
            console.log(`현재 남은 돈: ${new_money}`)
        }
    })
}


// 건물 및 장소
app.get("/outside", (request, response) => {  // 야외
    // 
});
app.get("/home", (request, response) => {  // 집
    // 
});
app.get("/store", (request, response) => {  // 상점
    // 
});
app.get("/conv_store", (request, response) => {  // 편의점 (convenience store)
    // 
});
app.get("/work", (request, response) => {  // 회사
    // 
});
app.get("/loan", (request, response) => {  // 사채
    // 
});
app.get("/stock", (request, response) => {  // 증권사 (stock firm)
    // 
});
app.get("/comm_center", (request, response) => {  // 복지관 (community center)
    // 
});
app.get("/real_estate", (request, response) => {  // 부동산
    // 
});
app.get("/bank", (request, response) => {  // 은행
    // 
});
app.get("/hospital", (request, response) => {  // 병원
    // 
});
app.get("/insurance", (request, response) => {  // 보험사
    // 
});
app.get("/park", (request, response) => {  // 공원
    // 
});


// 게임 끝
app.get("/room/:room_no/ranking", async (request, response) => {
    try {
        const { room_no } = request.params;
        const rankingQuery = `SELECT name, money - debt FROM characters WHERE room_no=$1 ORDER BY money - debt DESC`;

        const result = await dbClient.query(rankingQuery, [room_no]);
        const ranking = result.rows;

        response.status(200).json({ ranking });
    }
    catch (err) {
        console.error(err);
        response.status(500).json({ error: "Internal server error ranking" });
    }
})

app.delete("/clear", (request, response) => {  // 게임이 끝나면 모든 캐릭터 정보를 삭제한다.
    const clear_table = `TRUNCATE character`;
})

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log("게임 시작");
});
