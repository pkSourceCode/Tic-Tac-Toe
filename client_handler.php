<?php
class ClientHandler
{
    // User List with user details and socket resource //
    private $user_list = array();

    // SecKey for doHandShake //
    private $secKey = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

    // Time Function //
    private $timeZone = "Asia/Bangkok";

    public function __construct()
    {
        date_default_timezone_set($this->timeZone);
    }

    // Function to seal the message before sending it to clients //
    public function seal($data)
    {
        $b1 = 0x80 | (0x1 & 0x0f);
        $length = strlen($data);

        $header = "";
        if($length <= 125)
            $header = pack('CC', $b1, $length);
        else if($length > 125 && $length < 65536)
            $header = pack('CCn', $b1, 126, $length);
        else if($length >= 65536)
            $header = pack('CCNN', $b1, 127, $length);
        return $header.$data;
    }

    // Function to unseal the message before reading it //
    public function unseal($sealedData)
    {
        // ord function return ASCII value of integer character...
        $length = ord($sealedData) & 127;
        if($length === 126)
        {
            $masks = substr($sealedData, 4, 4);
            $data  = substr($sealedData, 8);
        }
        else if($length === 127)
        {
            $masks = substr($sealedData, 10, 4);
            $data  = substr($sealedData, 14);
        }
        else
        {
            $masks = substr($sealedData, 2, 4);
            $data  = substr($sealedData, 6);
        }
        $unsealedData = "";
        for($i = 0; $i <= strlen($data) - 1; ++$i)
            $unsealedData .= $data[$i] ^ $masks[$i%4];
        return $unsealedData;
    }

    // Upgrade client browser connection to TCP/IP //
    public function doHandShake($header, $clientSocket, $hostName, $port)
    {
        // Sending hand shake message to the new connected client //
        $headers = array();
        $lines   = preg_split("/\r\n/", $header);
        foreach($lines as $line)
        {
            $line = chop($line);
            if(preg_match('/\A(\S+): (.*)\z/', $line, $matches))
                $headers[$matches[1]] = $matches[2];
        }
        $secKey    = $headers['Sec-WebSocket-Key'];
        $pack      = pack('H*', sha1($secKey . $this->secKey));
        $secAccept = base64_encode($pack);
        $buffer    = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n".
            "Upgrade: websocket\r\n" .
            "Connection: Upgrade\r\n" .
            "WebSocket-Origin: $hostName\r\n" .
            "WebSocket-Location: ws://$hostName:$port/demo/shout.php\r\n" .
            "Sec-WebSocket-Accept:$secAccept\r\n\r\n";
        socket_write($clientSocket, $buffer, strlen($buffer));
    }

    // Return connection ACK to all connected clients //
    public function newConnectionACK($client_ip_address, &$clientSocket)
    {
        $message           = 'Client ' . $client_ip_address . ' has joined the server. ';
        $messageType       = "server-connection-ack";
        //$messageType       = "server-response";
        $guestName         = "guest_"  . $this->randomNumbers(5);
        $this->user_list[] = array("socket" => $clientSocket, 'username' => $guestName, 'ip' => $client_ip_address, 'matches' => 0, 'wins' => 0, 'lose' => 0, 'draw' => 0, 'status' => 'online', 'time-stamp' => '');

        //$msg               = $this->buildMessage($message, $messageType, "true");
        // Sending Loop //
        /*foreach ($this->user_list as $clients)
            socket_write($clients["socket"], $msg, strlen($msg));*/
        $this->returnUserListToAllClients($message, $messageType);
    }

    // Return disconnection ACK to all connected clients when client has disconnected from the client server //
    public function newDisConnectionACK($client_ip_address, &$clientSocket)
    {
        $message     = 'Client ' . $client_ip_address . ' has been disconnected from the server. ';
        $messageType = "server-disconnection-ack";
        //$messageType = "server-response";
        $index       = $this->getClientIndexFromSocket($clientSocket);

        // Array splice leaves no gap between elements of array //
        array_splice($this->user_list, $index, 1);
        // Unset leaves index gaps between elements of array //
        // unset($this->user_list[$index]);

        //$msg         = $this->buildMessage($message, $messageType, "true");
        // Sending Loop //
        /*foreach ($this->user_list as $clients)
            socket_write($clients["socket"], $msg, strlen($msg));*/
        $this->returnUserListToAllClients($message, $messageType);
    }

    // Change username by comparing client socket resource //
    public function changeUsername(&$clientSocket, $newUsername)
    {
        for($i = 0; $i <= count($this->user_list) - 1; $i++)
        {
            if($clientSocket === $this->user_list[$i]["socket"])
            {
                // $old variable is used just only to 'display' the old information about this particular user, not assign new data into it //
                $old = $this->getClientFromSocket($clientSocket);
                echo "\n" . $old["username"] . " is changing username to '" . $newUsername;
                $msg = $old["username"] . " is changing his/her username to " . $newUsername;
                $this->user_list[$i]["username"] = $newUsername;
                $this->returnUserListToAllClients($msg, "server-user-list");
                return true;
            }
        }
        return false;
    }

    // Change user status by comparing client socket resource. Returns false if status = "away" //
    public function changeUserStatus(&$clientSocket, $userStatus)
    {
        // TODO: Something wrong here $target does not point to the array element in the user_list variable //
        $index = $this->getClientIndexFromSocket($clientSocket);
        $status = trim($userStatus);
        if($status === "online")
        {
            $this->user_list[$index]["status"] = $status;
            $ret = true;
        }
        else if($status === "busy")
        {
            $this->user_list[$index]["status"] = $status;
            $ret = true;
        }
        else
        {
            $this->user_list[$index]["status"] = "away";
            $ret = false;
        }
        $msg = "'" . $this->user_list[$index]["username"] . "' has changed status to '" . $this->user_list[$index]['status'] . "'";
        $this->returnUserListToAllClients($msg, "server-user-list");
        return $ret;
    }

    // Return index of user_list array from target client socket resource //
    private function getClientIndexFromSocket(&$clientSocket)
    {
        $i = 0;
        foreach ($this->user_list as $client)
        {
            if($client["socket"] === $clientSocket)
                return $i;
            $i++;
        }
        return -1;
    }

    // Return user data of user_list array from socket resource. DOES NOT RETURN THE REFERENCE OF THE ARRAY ELEMENT //
    public function getClientFromSocket(&$clientSocket)
    {
        for($i = 0; $i <= count($this->user_list) - 1; $i++)
        {
            if($this->user_list[$i]["socket"] === $clientSocket)
                return $this->user_list[$i];
        }
        return false;
    }

    // Return true if username does not exist, false if exists //
    public function checkUserNameAvailability($username)
    {
        for($i = 0; $i <= count($this->user_list) - 1; $i++)
            if($this->user_list[$i]["username"] === $username)
                return false;
        return true;
    }

    /* TODO: FIX: UNDEFINED OFFSET  ----- ISSUE FIXED!!!! 8/9/2020
       FIXED: use isset function to check undefined indexes
       Noted: Try to use this function within this class....
              private encapsulation because the function is only allowed
              to be executed within this class... Why? I guess it's because
              of the access of user_list variable.... Still not so sure....*/

    // Return user list with 'you' tag to all clients //
    private function returnUserListToAllClients($message, $messageType)
    {
        foreach ($this->user_list as $client)
        {
            if(isset($client))
            {
                $userList = $this->user_list;
                for ($i = 0; $i <= count($userList) - 1; $i++)
                {
                    if(!isset($userList[$i]))
                        continue;
                    else
                        if ($client["socket"] === $userList[$i]["socket"])
                            $userList[$i]["you"] = "you";
                }
                $this->removeKey($userList, "socket");
                $msg = $this->buildMessage($message, $messageType, $userList);
                socket_write($client["socket"], $msg, strlen($msg));
            }
        }
    }

    // Return random characters //
    public function randomCharacters($length)
    {
        $seed = str_split('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        shuffle($seed);
        $rand = '';
        foreach(array_rand($seed, $length) as $index)
            $rand .= $seed[$index];
        return $rand;
    }

    // Return random numbers //
    public function randomNumbers($length)
    {
        $seed = str_split('0123456789');
        shuffle($seed);
        $rand = '';
        foreach(array_rand($seed, $length) as $index)
            $rand .= $seed[$index];
        return $rand;
    }

    // Remove specific key from array of client //
    private function removeKey(&$array, $key)
    {
        for($i = 0; $i <= count($array) - 1; $i++)
            unset($array[$i][$key]);
    }

    // Standard build message function. Use this to build message packet to communicate with the client //
    public function buildMessage($message, $messageType, $requestData)
    {
        $msg = array("message" => $message, "message-type" => $messageType, "request-data" => $requestData);
        return $this->seal(json_encode($msg));
    }

    // Prints out $this->user_list array //
    public function printUserList()
    {
        print_r($this->user_list);
    }
}
?>