function getOlder(new_age) {
    // new_age starts from 20;
    let minutes_passed = 0;
    
    const updateInterval = setInterval(() => {
        new_age += 1;
        minutes_passed += 2;

        if (minutes_passed < 90 && new_age < 65) {
            // const updateQuery = `UPDATE characters SET age = $1 WHERE room_no = $2`;

            // dbClient.query(updateQuery, [new_age, room_no]);
            console.log(`나이가 1살 늘어났습니다: ${new_age}세, 시간 경과: ${minutes_passed}`);
        }
        else {  // minutes_passed >= 90 && new_age >= 65
            clearInterval(updateInterval);
            console.log('게임 시간이 모두 초과되었습니다. 65세입니다.');
        }
    }, 1000);  // 2분 마다 업데이트: 2 * 60 * 1000
}

getOlder(20);