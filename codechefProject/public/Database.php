<?php
class Database{
	// password

	public connect(){
		$fp = new PDO('mysql:host=localhost;dbname=codechef', 'root', 'root');
		$fp->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $fp;
	}
}
?>