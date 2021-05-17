let player;
let player_list = [];

window.onload = function()
{
    player = new Player();
    init_player();
    init_menu();
    let tblObj = document.getElementById("game_board");
    let ttt    = new TicTacToe(tblObj);
    ttt.init();
    connectToServer();
}

function switchState(button)
{
    let val = button.value;
    let msg = {
        type: "change-user-status",
        data: { userStatus: "" }
    };
    switch (val)
    {
        case '0':
            button.innerHTML = "BUSY";
            button.className = "yellow";
            button.value     = 1;
            msg.data.userStatus = "busy";
        break;
        case '1':
            button.innerHTML = "AWAY";
            button.className = "red";
            button.value     = 2;
            msg.data.userStatus = "away";
            break;
        case '2':
            button.innerHTML = "ONLINE";
            button.className = "green";
            button.value     = 0;
            msg.data.userStatus = "online";
            break;
        default:
            button.innerHTML = "AWAY";
            button.className = "red";
            button.value     = 2;
            msg.data.userStatus = "away";
            break;
    }
    //console.log(msg);
    player.getSocket().send(JSON.stringify(msg));
}

function init_player()
{
    document.getElementById("btn_player_status").addEventListener("click", function (event)
    {switchState(this);});
    document.getElementById("txt_username").addEventListener("focusout", function()
    {changeUserName(this)});
}

function init_menu()
{
    menu_animation();
    let font_list = [
        {name:'varela',
        cssFace: 'myFont1, fantasy'},
        {name:'lobster',
        cssFace: 'myFont2, fantasy'},
        {name:'lexend',
        cssFace: 'myFont3, fantasy'},
        {name:'alfa',
        cssFace: 'myFont4, fantasy'},
        {name:'russo',
        cssFace: 'myFont5, fantasy'},
        {name: 'anton',
        cssFace: 'myFont6, fantasy'}
    ];

    let color_list = [
        {name: 'azure'},
        {name: 'pink'},
        {name: 'green'},
        {name: 'blue'},
        {name: 'yellow'},
        {name: 'purple'},
        {name: 'orange'},
        {name: 'white'},
        {name: 'lightgray'}
    ];

    let btn_switch_fonts = document.getElementById("btn_switch_font");
    let btn_switch_color = document.getElementById("btn_switch_color");
    let btn_about        = document.getElementById("btn_about");

    let target  = document.getElementById("game_board");
    let cells   = target.getElementsByTagName("div");

    btn_switch_fonts.addEventListener("click", function(){
        let current = parseInt(this.value);
        if(current < font_list.length - 1)
            current++;
        else
            current = 0;
        for(let i = 0; i <= cells.length - 1; i++)
            cells[i].style.fontFamily = font_list[current].cssFace;
        this.value = current;
        this.innerHTML = font_list[current].name.toUpperCase();
    });

    btn_switch_color.addEventListener("click", function()
    {
        let current = parseInt(this.value);
        if(current < color_list.length - 1)
            current++;
        else
            current = 0;
        target.setAttribute("class", color_list[current].name);
        this.value = current;
        this.innerHTML = color_list[current].name.toUpperCase();
    });

    btn_about.addEventListener("click", function(){

    });

}

function changeUserName(textBox)
{
    let currentName = player.name;
    let newName     = textBox.value.toString();
    if(newName.length >= 3 && newName !== currentName)
    {
        let confirm = window.confirm("Changing your name to '" + newName + "' \n\n\t" + "Press OK to confirm");
        if(confirm)
        {
            let msg  = {
                type: 'change-user-name',
                data: {
                    newUsername: newName
                }
            };
            player.getSocket().send(JSON.stringify(msg));
        }
        else
            window.alert("Name change cancel!");
    }
    else
        window.alert("New name has to be at least 3 characters long, and not the same as current ones. \n\n\tPlease choose another name.");
}

function menu_animation()
{
    let game_control = document.getElementById("game_control");
    let divs         = game_control.getElementsByClassName("outer");
    for(let i = 0 ; i <= divs.length - 1; i++)
    {
        divs[i].addEventListener("mouseover", function(){
            let target = this.getElementsByTagName("div")[0];
            target.setAttribute("class", "curtain curtain_off");
        });

        divs[i].addEventListener("mouseout", function(){
            let target = this.getElementsByTagName("div")[0];
            target.setAttribute("class", "curtain curtain_on");
        });
    }
}

function connectToServer()
{
    let host      = "127.0.0.1";
    host          = "192.168.1.17";
    let port      = 2323;
    let url       = "ws://" + host + ":" + port + "/tic-tac-toe/client_server.php";
    let webSocket = new WebSocket(url);
    player.setSocket(webSocket);

    webSocket.onopen = function(event)
    {
    }

    webSocket.onmessage = function(event)
    {
        let data = JSON.parse(event.data);
        let messageType = checkMessageType(data["message-type"]);
        if(messageType === 0)
            firstConnect(data);
        else if(messageType === 1)
            disconnectionHandler(data);
        else if(messageType === 2)
            updateUserList(data);
        else if(messageType === -1)
            console.log(data);
    }

    webSocket.onerror = function(event)
    {

    }

    webSocket.onclose = function(event)
    {

    }
}

function checkMessageType(messageType)
{
    switch(messageType)
    {
        case 'server-connection-ack':
        return 0;
        case 'server-disconnection-ack':
        return 1;
        case 'server-user-list':
        return 2;
        case 'server-response':
        return -1;
    }
}

function disconnectionHandler(data)
{
    let userList   = data["request-data"];
    let playerList = getPlayerList(userList);
    console.log(userList);
    document.getElementById("player_list").innerHTML = playerList;
}

function firstConnect(data)
{
    let userList   = data["request-data"];
    let yourInfo   = getYourInfoData(userList);
    let playerList = getPlayerList(userList);
    let matches    = yourInfo["matches"];
    let wins       = yourInfo["wins"];
    let draw       = yourInfo["draw"];
    let lose       = yourInfo["lose"];
    let ip         = yourInfo["ip"];
    let status     = yourInfo["status"];
    document.getElementById("player_list").innerHTML = playerList;
    player.setName(yourInfo["username"]);
    player.setStatus(status);
    player.setIp(ip);
    player.setPlayerStatus(matches, wins, draw, lose);
    console.log("=== Your Info ===\n", player.printInfo());
}

function getYourInfoData(userList)
{
    for(let i = 0; i <= userList.length - 1; i++)
        if(userList[i].hasOwnProperty("you"))
            return userList[i];
}

function updateUserList(data)
{
    console.log(data);
    document.getElementById("player_list").innerHTML = getPlayerList(data["request-data"]);
}

function getPlayerList(userList)
{
    let data = "";
    for(let i = 0; i <= userList.length - 1; i++)
    {
        if(!userList[i].hasOwnProperty("you"))
        {
            let username = userList[i]["username"];
            let ip       = userList[i]["ip"];
            let matches  = userList[i]["matches"];
            let wins     = userList[i]["wins"];
            //let lose     = userList[i]["lose"];
            let status   = userList[i]["status"];
            let userRow  = createPlayerData(username, matches, wins, ip, status);
            data += userRow;
        }
    }
    return data;
}

function createPlayerData(name, matches, wins, ip, status)
{
    let str = `<tr>
        <th>`+ name +`</th>
        <th>Matches:`+ matches + `</th>
        <th>Wins:` + wins + `</th>
        <th>`+ ip +`</th>`;
    if(status === "online")
        str += `<th class="player_online"><button id="challenge_player" value="challenge_`+ name +`"><text></text>&nbsp;</button></th>`;
    else if(status === 'busy')
        str += `<th class="player_busy"><button id="challenge_player" value="challenge_`+ name +`"><text></text>&nbsp;</button></th>`;
    else if(status === 'away')
        str += `<th class="player_away"><button id="challenge_player" value="challenge_`+ name +`"><text></text>&nbsp;</button></th>`;
    else if(status === 'playing')
        str += `<th class="player_playing"><button id="challenge_player" style="cursor: not-allowed;" disabled value="challenge_`+ name +`"><text></text>&nbsp;</button></th>`;
    str += `</tr>`;
    return str;
}