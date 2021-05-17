class Player
{
    constructor()
    {
        this.webSocket = null;
        this.name = "";
        this.matches = [];
        this.wins    = 0;
        this.draw    = 0;
        this.lose    = 0;
        this.ip      = '';
        this.status  = '';
    }

    setSocket(socket)
    {
        this.webSocket = socket;
    }

    getSocket()
    {
        return this.webSocket;
    }

    setName(name)
    {
        this.name = name;
        document.getElementById("txt_username").value = name;
    }

    setIp(ip)
    {
        this.ip = ip;
    }

    setStatus(status)
    {
        this.status = status;
    }

    setPlayerStatus(matches, wins, draw, lose)
    {
        this.matches = matches;
        this.wins    = wins;
        this.draw    = draw;
        this.lose    = lose;
    }

    printInfo()
    {
        let str = "Username: \t" + this.name + "\n";
        str    += "IP: \t"       + this.ip + "\n";
        str    += "Status: \t"   + this.status + "\n";
        str    += "Wins: \t"     + this.wins + "\n";
        str    += "Draws: \t"    + this.draw + "\n";
        str    += "Lose: \t"     + this.lose + "\n";
        str    += "Matches: \t"  + this.matches.length + "\n";
        return str;
    }

    printMatches()
    {
        return this.matches;
    }
    
}

class Opponent
{
    constructor()
    {
        this.name = "";
        this.ip_address ="";
        this.wins = 0;
        this.lose = 0;
        this.draw = 0;
    }

    updateName(name)
    {
        this.name = name;
    }
}

class Match
{
    constructor()
    {
        this.matchId = "";
        this.playerX = "";
        this.playerO = "";
    }
}