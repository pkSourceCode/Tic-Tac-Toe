<?php
// This file is used for handling client connections //
require_once("client_handler.php");

//define("HOST_NAME", "127.0.0.1");
define("HOST_NAME", "192.168.1.17");
define("PORT",       2323);

$null = null;

class ClientServer
{
    // MAX CLIENT NUMBER //
    const MAX_CLIENT_POOL = 100;
    // SOCKET RESOURCE //
    private $serverSocket;
    // CONNECTION LIST //
    private $clientSocketList = array();
    // CLIENT HANDLER  //
    private $client;

    public function __construct()
    {
        $this->serverSocket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        socket_set_option($this->serverSocket, SOL_SOCKET, SO_REUSEADDR, 1);
        socket_bind($this->serverSocket, HOST_NAME, PORT);
        printf("Listening for the first client connection...%s\r", socket_listen($this->serverSocket));
        $this->client = new ClientHandler();
    }

    public function run()
    {
        while(true)
        {
            $read   = array();
            $read[] = $this->serverSocket;

            foreach($this->clientSocketList as $client)
                $read[] = $client;


            $select = socket_select($read, $null, $null, $null, $null);
            if($select === 0)
                continue;

            $this->establishNewClientConnection($read);
            $this->clientReadMessage($read);
        }
    }

    private function establishNewClientConnection(&$read)
    {
        if(in_array($this->serverSocket, $read))
        {
            if(count($this->clientSocketList) < self::MAX_CLIENT_POOL)
            {
                echo "\n\t == New Client Accepted!!! ==";
                $clientSocket = socket_accept($this->serverSocket);
                $this->clientSocketList[] = $clientSocket;
                $header       = socket_read($clientSocket, 1024);
                $this->client->doHandShake($header, $clientSocket, HOST_NAME, PORT);
                socket_getpeername($clientSocket, $clientIpAddress);
                $this->client->newConnectionACK($clientIpAddress, $clientSocket);
                //print_r($this->clientSocketList);
            }
            else
                echo "Max Clients Reached!!!\n\n";
            $listeningSocketIndex = array_search($this->serverSocket, $read);
            unset($read[$listeningSocketIndex]);
        }
    }

    private function clientReadMessage(&$read)
    {
        foreach($read as $clientSocket)
        {
            $byteSocket = @socket_recv($clientSocket, $buf, 1024, 0);
            while($byteSocket >= 1)
            {
                $socketMessage = $this->client->unseal($buf);
                $messageObj    = json_decode($socketMessage, true);
                /*
                 * Noted: json object with nested objects, or arrays
                 *        cannot be accessed to target object values
                 *        with the arrow operator or array indexes....
                 *
                 * Fix:   json_decode($socketMessage, true); second parameter
                 *        of json_decode will make the function returns an array
                 *        instead of stdClass
                 * */
                if($messageObj !== null)
                {
                    $type = $messageObj["type"];
                    $this->changeName($clientSocket,   $type, $messageObj["data"]);
                    $this->changeStatus($clientSocket, $type, $messageObj["data"]);
                    //print_r($messageObj);
                }
                // break 2 ?? why??? Time to find out... :)
                break 2;
            }
            $this->checkClientMessageStatus($clientSocket);
        }
    }

    private function checkClientMessageStatus($clientSocket)
    {
        $socketData = @socket_read($clientSocket, 1024, PHP_NORMAL_READ);
        if($socketData === false)
        {
            echo "Client is disconnecting\n";
            socket_getpeername($clientSocket, $client_ip_address);
            $this->client->newDisConnectionACK($client_ip_address, $clientSocket);
            $index = array_search($clientSocket, $this->clientSocketList);
            unset($this->clientSocketList[$index]);
            print_r($this->clientSocketList);
        }
    }

    private function send($msg)
    {
        for ($i = 0; $i <= count($this->clientSocketList) - 1; $i++)
            @socket_write($this->clientSocketList[$i], $msg, strlen($msg));
    }

    public function closeSocket()
    {
        socket_close($this->serverSocket);
    }

    private function changeName($clientSocket, $messageType, $requestData)
    {
        if($messageType === "change-user-name")
        {
            $newUsername = $requestData["newUsername"];
            if($this->client->changeUsername($clientSocket, $newUsername))
                echo "\n\t $clientSocket has changed his/her username\n";
        }
    }

    private function changeStatus($clientSocket, $messageType, $requestData)
    {
        if($messageType === "change-user-status")
        {
            $newUserStatus = $requestData["userStatus"];
            if($this->client->changeUserStatus($clientSocket, $newUserStatus))
                echo "\n\t $clientSocket has changed his/her status to '" . $newUserStatus . "'";
            else
                echo "\n\t $clientSocket is now 'away'";
        }
    }

    private function printAllClients()
    {
    }

}

$gameServer = new ClientServer();
$gameServer->run();
$gameServer->closeSocket();