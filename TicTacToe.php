<?php
// TIC-TAC-TOE Game
// Author: Piyapan K
// Date:   2/09/2020

class TicTacToe
{
    // -1 = idle, 0 = X, 1 = O, 2 = X Wins, 3 = O Wins, 4 = Draws //
    private $state = 0;

    // Cell array //
    private $tableArray;
    /*
     * 0 | 1 | 2
     * 3 | 4 | 5
     * 6 | 7 | 8
     * */

    public  function __construct()
    {
        $this->clearTable();
        $this->init();
    }

    public  function init()
    {
        $this->state      = -1;
        $this->tableArray = array(
             ["mark" => "!", "disable" => false], ["mark" => "!", "disable" => false], ["mark" => "!", "disable" => false]
            ,["mark" => "!", "disable" => false], ["mark" => "!", "disable" => false], ["mark" => "!", "disable" => false]
            ,["mark" => "!", "disable" => false], ["mark" => "!", "disable" => false], ["mark" => "!", "disable" => false]
        );
    }

    public  function markCell($cellIndex)
    {
        if($this->state === 0 || $this->state === 1)
        {
            $targetCell = &$this->tableArray[$cellIndex];
            if ($targetCell["disable"] === false && $targetCell["mark"] === "!")
            {
                if ($this->state === 0)
                {
                    $this->tableArray[$cellIndex]["mark"] = "X";
                    $this->tableArray[$cellIndex]["disable"] = true;
                    $winFlag = $this->checkWin($this->state);
                    if($winFlag === 2)
                        $this->disableTable();
                    else
                    {
                        $drawFlag = $this->checkDraw();
                        if(!$drawFlag)
                            $this->setState(1);
                        else
                        {
                            $this->disableTable();
                            $this->setState(4);
                        }
                    }
                }
                else if ($this->state === 1)
                {
                    $this->tableArray[$cellIndex]["mark"] = "O";
                    $this->tableArray[$cellIndex]["disable"] = true;
                    $winFlag = $this->checkWin($this->state);
                    if($winFlag === 2)
                        $this->disableTable();
                    else
                    {
                        $drawFlag = $this->checkDraw();
                        if(!$drawFlag)
                            $this->setState(0);
                        else
                        {
                            $this->disableTable();
                            $this->setState(4);
                        }
                    }
                }
            }
        }
    }

    private function checkDraw()
    {
        $total = 0;
        for($i = 0 ; $i <= count($this->tableArray) - 1; $i++)
        {
            if($this->tableArray[$i]["mark"] === "!")
                $total++;
        }
        if($total <= 0)
            return true;
        else
            return false;
    }

    private function checkWin($turns)
    {
        $ver = [[0,3,6],
                [1,4,7],
                [2,5,8]];

        $hor = [[0,1,2],
                [3,4,5],
                [6,7,8]];

        $dia = [[0,4,8],
                [2,4,6]];

        for($i = 0; $i <= count($ver) - 1; $i++)
        {
            $flag = $this->checkWinConditions($ver[$i], $turns);
            if($flag !== false)
                return $flag;
        }

        for($i = 0; $i <= count($hor) - 1; $i++)
        {
            $flag = $this->checkWinConditions($hor[$i], $turns);
            if($flag !== false)
                return $flag;
        }

        for($i = 0; $i <= count($dia) - 1; $i++)
        {
            $flag = $this->checkWinConditions($dia[$i], $turns);
            if($flag !== false)
                return $flag;
        }
        return false;
    }

    private function checkWinConditions($cond, $turns)
    {
        $cells = [];
        $chk = 0;
        $txt = null;

        if($turns === 0)
            $txt = "X";
        else if($turns === 1)
            $txt = "O";

        for($i = 0; $i <= count($cond) - 1; $i++)
        {
            $index = $cond[$i];
            $mark  = $this->tableArray[$index]["mark"];
            if($mark === $txt)
            {
                $chk++;
                array_push($cells, $index);
                if($chk >= 3)
                {
                    $wonPlayer = $this->getWinState($turns);
                    $this->setState($wonPlayer);
                    return $wonPlayer;
                }
            }
        }
        return false;
    }

    private function getWinState($turns)
    {
        if($turns === 0)
            return 2;
        else if($turns === 1)
            return 3;
        return null;
    }

    private function setState($state)
    {
        $this->state = $state;
        switch($this->state)
        {
            case -1:
                print("Idle...");
                break;
            case 0:
                print("X Turns...");
                break;
            case 1:
                print("O Turns...");
                break;
            case 2:
                print("Player X Wins!");
                break;
            case 3:
                print("Player O Wins!");
                break;
            case 4:
                print("Draw...");
                break;
            default:
                print("Invalid State...");
                break;
        }
    }

    private function clearTable()
    {
        $this->tableArray = [];
    }

    private function disableTable()
    {
        for($i = 0; $i <= count($this->tableArray) - 1; $i++)
            $this->tableArray[$i]["disable"] = true;
    }
}