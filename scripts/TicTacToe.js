// Simple TIC TAC TOE game with JavaScript //
// Author: Piyapan K   //
// Date:   30/08/2020  //

                    // LESSON FROM THIS PROJECT!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //

/* 1. DO NOT USE STUPID SHIT HTML ELEMENTS AS DATA VARIABLES
   2. DO NOT!!!!!!!!!!! USE STUPID SHIT DOM ELEMENT AS VARIABLE TO STORE YOUR DATA
   3. CREATE NEW OBJECT CALL 'TABLE' OR WHAT EVER IT IS, AND PROCESS YOUR DATA ON THAT OBJECT
   4. SAME VARIABLES OR EVEN HTML ELEMENT OBJECT, WHEN ADDED THEM INTO DIFFERENT OBJECTS, THEY WILL NO LONGER SHARE THE SAME MEMORY,
      ENDED UP BECOMING DIFFERENT VARIABLE */

class TicTacToe
{
    constructor(tableObj)
    {
        this.table      = tableObj;
        // 2D Array //
        this.tableArray = [];
        // 1D Array //
        this.cellArray  = [];
        // Game Status //
        // -1 Idle
        //  0  X turns
        //  1  O turns
        //  2  X Wins
        //  3  O Wins
        this.turns      = -1;


        this.highlightColor = {
            win: "crimson",
            draw: "darkseagreen"
        };
    }

    init()
    {
        this.tableArray = [];
        this.cellArray  = [];
        // Get Table Elements //
        let rows = this.table.getElementsByTagName("tr");
        let cell = [];
        for(let i = 0; i <= rows.length - 1; i++)
            cell.push(rows[i].getElementsByTagName("th"));
        // Add Listener to every cells //
        for(let i = 0; i <= cell.length - 1; i++)
        {
            let row = cell[i];
            this.tableArray[i] = [];
            for(let j = 0; j <= row.length - 1; j++)
            {

                row[j].removeEventListener("mouseover", () => this.mouseOverCell(row[j]));
                row[j].removeEventListener("mouseout",  () => this.mouseOutCell(row[j]));
                row[j].removeEventListener("click",     () => this.mouseClickCell(row[j]));

                row[j].addEventListener("mouseover", () => this.mouseOverCell(row[j]));
                row[j].addEventListener("mouseout",  () => this.mouseOutCell(row[j]));

                // In order to removeEventListener, the same function has to be passed in //
                // Can not use the anonymous function //
                //let func = () => this.mouseClickCell(row[j]);
                row[j].addEventListener("click",     () => this.mouseClickCell(row[j]));
                /*let func = () => this.mouseClickCell(row[j]);
                row[j].addEventListener("click", function(){
                    func();

                });*/
                //row[j].removeEventListener("click", func);

                // This is one of my sad moment to know that element store in cellArray isn't the same as it is in table Array.
                // WTF??!! O _o?

                // I just realized that once object has been created, the variable no longer shares the same memory... SAD!

                this.tableArray[i].push({elem: row[j], disable: 0});
                // When you update elements in table array (or in cellArray), it suppose to update those that are stored in cellArray.... totally disappointed... :(

                this.cellArray.push({elem:row[j], disable: 0});
            }
        }
        //console.log(this.tableArray);

        window.setTimeout(this.initChange.bind(this), 1000);
    }

    update()
    {
        console.log("Click");
    }

    getCell(i, j)
    {
        return this.tableArray[i][j];
    }

    getCellDiv(i, j)
    {
        return this.tableArray[i][j].elem.getElementsByTagName("div")[0];
    }

    getCellText(i, j)
    {
        return this.getCellDiv(i, j).getElementsByTagName("text")[0];
    }

    setTurnStatus(status)
    {
        this.turns = status;
        switch (this.turns)
        {
            case -1:
                console.log("Idle...");
                break;
            case 0:
                console.log("X Turns...");
                break;
            case 1:
                console.log("O Turns...");
                break;
            case 2:
                console.log("Player X Wins!");
                break;
            case 3:
                console.log("Player O Wins!");
                break;
            case 4:
                console.log("Draw...");
                break;
            default:
                console.log("Invalid State...");
                break;
        }
    }

    updateCellArray(index, char)
    {
        this.cellArray[index].elem.getElementsByTagName("text")[0].innerHTML = char;
    }

    clearTable()
    {
        this.init();
    }

    mouseOverCell(cell)
    {
        let div = cell.getElementsByTagName("div")[0];
        let target = div.getElementsByTagName("text")[0];
        div.setAttribute("class", "cell-hover");
    }

    mouseOutCell(cell)
    {
        let div = cell.getElementsByTagName("div")[0];
        div.setAttribute("class", "");
    }

    mouseClickCell(cell)
    {
        let cellIndex  = this.getIndexFromCell(cell);
        let cellCords  = this.getCoordinateFromCell(cell);
        let i          = cellCords.i;
        let j          = cellCords.j;
        let c          = cell.getElementsByTagName("div")[0];
        let target     = c.getElementsByTagName("text")[0];
        /* For testing purposes */
        let disable = this.tableArray[i][j].disable;
        if(disable === 0 && (this.turns === 0 || this.turns === 1)) {
            if (this.turns === 0) {
                this.changeCellValue(target, "X", cellIndex);
                this.tableArray[i][j].disable     = 1;
                this.cellArray[cellIndex].disable = 1;
                let winFlag = this.checkWins(this.turns);
                if (winFlag === 2)
                    this.disableTable();
                else
                {
                    let drawFlag = this.checkDraw();
                    if(!drawFlag)
                        this.setTurnStatus(1);
                    else if(drawFlag)
                    {
                        this.disableTable();
                        this.setTurnStatus(4);
                    }
                }
            } else if(this.turns === 1) {
                this.changeCellValue(target, "O", cellIndex);
                this.tableArray[i][j].disable     = 1;
                this.cellArray[cellIndex].disable = 1;
                let winFlag = this.checkWins(this.turns);
                if (winFlag === 2)
                    this.disableTable();
                else
                {
                    let drawFlag = this.checkDraw();
                    if(!drawFlag)
                        this.setTurnStatus(0);
                    else if(drawFlag)
                    {
                        this.disableTable();
                        this.setTurnStatus(4);
                    }
                }
            }
        }
    }

    changeCellValue(target, char, cellIndex, animation = null)
    {
        if(animation === null)
        {
            // Animation dose not work properly due to your stupid shit HTML element as data variable... //
            target.style.opacity = '0';
            // System had to assign char into the cellArray immediately because this variable has be to used to calculate in checkWins function //
            // In order to make this work properly, you need two variable objects. One for processing, and one for displaying to the user... Make no mistake next time.
            this.updateCellArray(cellIndex, char);
            target.innerHTML = char;
            window.setTimeout(function () {
                target.style.opacity = '1';
            }, 500);
        }
    }

    getIndex(i, j)
    {
        return i * 3 + j;
    }

    getCoordinateFromCell(cell)
    {
        for(let i = 0; i <= this.cellArray.length - 1; i++)
        {
            if(cell === this.cellArray[i].elem)
            {
                let cord = this.getCoordinateFromIndex(i);
                return {i: cord.x, j: cord.y};
            }
        }
    }

    disableTable()
    {
        for(let i = 0; i <= this.tableArray.length - 1; i++)
        {
            let row = this.tableArray[i];
            for (let j = 0; j <= row.length - 1; j++)
                row[j].disable = 1;
        }
        for(let i = 0; i <= this.cellArray.length - 1; i++)
            this.cellArray[i].disable = 1;
    }

    getIndexFromCell(cell)
    {
        for(let i = 0; i <= this.cellArray.length - 1; i++)
        {
            if(cell === this.cellArray[i].elem)
                return i;
        }
    }

    getCoordinateFromIndex(index)
    {
        let i = Math.floor(index / 3);
        let j = index - 3 * i;
        return {x:i, y:j};
    }

    getCellMarkFromArray(cell)
    {
        return cell.getElementsByTagName("text")[0].innerHTML;
    }

    // TODO: Add delay //
    initChange()
    {
        let time;
        let delay = 250;
        for(let i = 0; i <= this.cellArray.length - 1; i++)
        {
            time  = i * delay;
            /*let cord   = this.getCoordinateFromIndex(i);
            let target   = this.getCellText(cord.x, cord.y);*/
            let cellBg   = this.cellArray[i].elem.getElementsByTagName("div")[0];
            let target   = this.cellArray[i].elem.getElementsByTagName("text")[0];
            let func     = () => this.changeCellValue(target, "!", i)
            setTimeout(function()
            {
                cellBg.style.backgroundColor = "whitesmoke";
                func();
            }, time);
        }
        time += delay * 4;
        setTimeout(() => this.setTurnStatus(0), time);
    }

    checkDraw()
    {
        let drawFlag;
        let total    = 0;
        for(let i = 0; i <= this.cellArray.length - 1; i++)
        {
            let mark = this.getCellMarkFromArray(this.cellArray[i].elem)
            if(mark === "!")
                total++;
        }
        if(total <= 0)
        {
            drawFlag = true;
            this.highlightCell( [0,1,2,3,4,5,6,7,8], this.highlightColor.draw);
        }
        else
            drawFlag = false;

        return drawFlag;
    }

    checkWins(turns)
    {
        let winConditions = {
             // Vertical //
            ver:[[0, 3, 6],
                 [1, 4, 7],
                 [2, 5, 8]],
            // Horizontal //
            hor:[[0, 1, 2],
                 [3, 4, 5],
                 [6, 7, 8]],
             // Diagonal //
            dia:[[0, 4, 8],
                 [2, 4, 6]]
        };
        let flag;
        for(let i = 0; i <= winConditions.ver.length - 1; i++)
        {
            let cond = winConditions.ver[i];
            flag = this.checkCond(cond, turns);
            if(flag !== false)
                return flag;
        }
        for(let i = 0; i <= winConditions.hor.length - 1; i++)
        {
            let cond = winConditions.hor[i];
            flag = this.checkCond(cond, turns);
            if(flag !== false)
                return flag;
        }
        for(let i = 0; i <= winConditions.dia.length - 1; i++)
        {
            let cond = winConditions.dia[i];
            flag = this.checkCond(cond, turns);
            if(flag !== false)
                return flag;
        }
    }

    checkCond(conditions, turns)
    {
        let cells = [];

        let chk = 0;
        let txt;

        if(turns === 0)
            txt = "X";
        else if(turns === 1)
            txt = "O";

        for(let i = 0; i <= conditions.length - 1; i++)
        {
            let index = conditions[i];
            let elem  = this.cellArray[index].elem;
            let mark  = this.getCellMarkFromArray(elem);
            if(mark === txt)
            {
                chk++;
                cells.push(index);
                if(chk >= 3)
                {
                    let wonPlayer = this.getWinState(turns);
                    this.setTurnStatus(wonPlayer);
                    this.highlightCell(cells, this.highlightColor.win);
                    return wonPlayer;
                }
            }
        }
        return false;
    }

    getWinState(turn)
    {
        if(turn === 0)
            return 2;
        else if(turn === 1)
            return 3;
    }

    checkCellChanged(target)
    {

    }

    resetCell(target)
    {

    }

    highlightCell(cells, color)
    {
        let target;
        let originalColor = this.cellArray[cells[0]].elem.childNodes[0].style.backgroundColor;
        let cellsArray = this.cellArray;
        for(let i = 0; i <= cells.length - 1; i++)
        {
            target = cellsArray[cells[i]].elem.childNodes[0];
            target.style.backgroundColor = color;
        }
        let time  = 0;
        let delay = 250;
        let times = 10;
        for(let l = 0; l <= times; l++)
        {
            time = l * delay;
            window.setTimeout(function () {
                for (let i = 0; i <= cells.length - 1; i++) {
                    target = cellsArray[cells[i]].elem.childNodes[0];
                    if(l%2 === 0)
                    {
                        target.style.backgroundColor = color;
                        target.getElementsByTagName("text")[0].style.textShadow = "1px 1px 50px ghostwhite";
                    }
                    else
                    {
                        target.style.backgroundColor = originalColor;
                        target.getElementsByTagName("text")[0].style.textShadow = "none";
                    }
                }
            }, time);
        }

        this.displayGameOver((times + 1) * delay);
    }

    displayGameOver(timeout)
    {
        let func = () => this.clearTable();
        window.setTimeout(function () {
            console.log("Display Alert Box");
            let alert_panel = new GameAlertPanel();
            let closeBtn =  alert_panel.createCloseButton("btn_give_up", "GIVE UP", "click", function(){console.log("Reset TicTacTor Board");
                func();});
            alert_panel.addBotElement(closeBtn);
            alert_panel.show();
        }, timeout);
    }

    displayGameDraw(timeout)
    {

    }
}