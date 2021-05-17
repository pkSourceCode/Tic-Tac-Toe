<html lang="en">
<head>
    <title> | O | X | O | Online Tic Tac Toe</title>
    <link rel="stylesheet" type="text/css" href="styles/style1.css"/>
    <link rel="stylesheet" type="text/css" href="styles/style2.css"/>
</head>
    <body>
        <div id="wrapper">
            <div id="game_control">
                <div class="outer"><div class="curtain curtain_on"><label>TIC</label></div><button value="0" id="btn_switch_font">SWITCH FONT</button></div>
                <div class="outer"><div class="curtain curtain_on"><label>TAC</label></div><button value="0" id="btn_switch_color">SWITCH COLOR</button></div>
                <div class="outer"><div class="curtain curtain_on"><label>TOE</label></div><button id="btn_about">ABOUT</button></div>
            </div>
            <div id="game_board_wrapper">
                <div id="game_panel">
                    <table id="game_board" class="azure">
                        <tr><th><div class="whitesmoke"><text>X</text></div></th><th><div class="whitesmoke"><text>O</text></div></th><th><div class="whitesmoke"><text>X</text></div></th></tr>
                        <tr><th><div class="whitesmoke"><text>O</text></div></th><th><div class="whitesmoke"><text>X</text></div></th><th><div class="whitesmoke"><text>O</text></div></th></tr>
                        <tr><th><div class="whitesmoke"><text>X</text></div></th><th><div class="whitesmoke"><text>O</text></div></th><th><div class="whitesmoke"><text>X</text></div></th></tr>
                    </table>
                </div>
                <div id="alert_panel" class="close">
                    <div id="alert_box">
                        <div id="alert_box_top">GAME OVER</div>
                        <div id="alert_box_mid">XX has won the match</div>
                        <div id="alert_box_bot"></div>
                    </div>
                </div>
            </div>
            <hr/>
            <fieldset id="matches">
                <legend>Matches</legend>
                <table id="your_matches">
                    <thead>
                        <tr>
                            <th id="match_your_name">Guest</th>
                            <th id="match_wins">WINS: 0</th>
                            <th id="match_lose">LOSE: 0</th>
                            <th id="match_draw">DRAW: 0</th>
                            <th id="match_status">Player</th>
                        </tr>
                    </thead>
                </table>
                <div>
                    <hr/>
                    <table class="data_table" id="match_list">
                        <tr>
                            <th>Guest 1234</th>
                            <th>Wins: 0</th>
                            <th>Draws:0 </th>
                            <th>Wins:0</th>
                            <th>Guest 4324</th>
                        </tr>
                    </table>
                </div>
            </fieldset>
            <fieldset id="players">
                <legend>Players</legend>
                <table id="your_info">
                    <thead>
                    <tr>
                        <th id="info_your_name"><label><input id="txt_username" type="text" placeholder="Your Name" value="Guest" /></label></th>
                        <th id="info_wins">Matches: 0</th>
                        <th id="info_lose">WINS: 0</th>
                        <th id="info_draw">DRAW: 0</th>
                        <th id="info_status"><button value="0" id="btn_player_status" class="green">ONLINE</button></th>
                    </tr>
                    </thead>
                </table>
                <div>
                    <hr/>
                    <table class="data_table" id="player_list">
                        <tr>
                            <th>Guest 1234</th>
                            <th>Matches: 0</th>
                            <th>Wins:0</th>
                            <th>IP</th>
                            <th class="player_online"><button id="challenge_player" value="challenge_this_player"><text></text>&nbsp;</button></th>
                        </tr>
                    </table>
                </div>
            </fieldset>
        </div>
    </body>
    <script type="text/javascript" src="scripts/my-animation.js"></script>
    <script type="text/javascript" src="scripts/game-alert.js"></script>
    <script type="text/javascript" src="scripts/player.js"></script>
    <script type="text/javascript" src="scripts/TicTacToe.js"></script>
    <script type="text/javascript" src="scripts/client_script.js"></script>

</html>