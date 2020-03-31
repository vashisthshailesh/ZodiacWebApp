<?php

require '../vendor/autoload.php';
$app = new \Slim\App();
$container = $app->getContainer();

class config{
	static $client_id ;
	static $client_secret ;
	static $api_endpoint ;
	static $authorization_code_endpoint;
	static $access_token_endpoint;
	static $redirect_uri;
	static $website_base_url ;
	static $check;

	public function __construct(){
		$this->client_id = '8b5b6fecb503998bab4ca779f54946ed';
		$this->client_secret = 'a2ea7ed616d607477910a04163914a8c';
		$this->api_endpoint = 'https://api.codechef.com/';
		$this->authorization_code_endpoint = 'https://api.codechef.com/oauth/authorize';
		$this->access_token_endpoint = 'https://api.codechef.com/oauth/token';
		$this->redirect_uri = 'http://localhost:8000/';
		$this->website_base_url = 'http://localhost:8000/';
	}
}

class oauth_details{
	static $authorization_code ;
	static $access_token ; 
	static $refresh_token ;
	static $scope ;
	public function __construct(){
		$this->authorization_code =  "";
		$this->access_token = " ";
		$this->refresh_token="";
		$this->scope = "";
	}
}

$container['config'] =function($c){
	
	$instance =  new config();
	return $instance;
};


$container['oauth_details'] =function($c){ 
	$instance = new oauth_details();
	return $instance;
};


$container['view'] = function($container){
	$view = new \Slim\Views\Twig('../views',[
		'cache' => false
	]);

	return $view;
};

$container['db']= function(){
	return new PDO('mysql:host=localhost;dbname=codechef', 'root', 'root');
};

function make_curl_request($url, $post = FALSE, $headers = array())
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

    if ($post) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post));
    }

    $headers[] = 'content-Type: application/json';
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($ch);
    return $response;
}

function make_api_request($path,$oauth_config,$querypost){

    $headers[] = 'Authorization: Bearer ' . $oauth_config['access_token'];
    return make_curl_request($path, $querypost, $headers);
}


function generate_access_token_first_time($config){
	session_start();

    $oauth_config = array('grant_type' => 'authorization_code', 'code'=> $_SESSION['authorization_code'], 'client_id' => $config->client_id, 'client_secret' => $config->client_secret, 'redirect_uri'=> $config->redirect_uri);
   
    $response = json_decode(make_curl_request($config->access_token_endpoint, $oauth_config), true);
    $result = $response['result']['data'];
	$_SESSION['access_token'] =  $result['access_token'];
    $_SESSION['refresh_token'] = $result['refresh_token'];
    $_SESSION['scope'] = $result['scope'];
}


function makeContestCodeRequestApi($contestcode, $oauth_details, $config){
	$path = $config->api_endpoint."contests/".$contestcode;
	$x = false;
	$response = make_api_request($path, $oauth_details,$x );
	return $response;
}

function makeQuestionReuqestApi($contestcode,$questioncode,$oauth_details,$config){
	$path = $config->api_endpoint."contests/".$contestcode."/problems/".$questioncode;
	$x =false;
	$response = make_api_request($path,$oauth_details, $x);
	return $response;
}

function makeCodeRunRequestApi($data) {
	$jsonObject = 
		array(
			"sourceCode"=> $data['sourceCode'],
			"language" => "C++14",
			"input" => $data['input']
		);
	$json = json_encode($jsonObject);
	// $query = 'curl --header "Content-Type: application/json"'.
	// ' --request POST'.
 //  	' --data "'.$json.'"'.
 //  	' https://api.codechef.com/ide/run';
$temp2 = array('authorization_code' => "eca8c8d7b3179b0f25a77a01682921cf817108f4",'access_token'=> "d33a08a936970188148295140275f1d88bdbee6a");
  $response = json_decode(make_api_request("https://api.codechef.com/ide/run",$temp2, $jsonObject), true);
  $linkId = $response['result']['data']['link'];
  sleep(5);
  $response = json_decode(make_api_request("https://api.codechef.com/ide/status?link=".$linkId, $temp2, false), true);
  return json_encode(array(
  	"output" => $response['result']['data']['output'],
  	"cmpinfo" => $response['result']['data']['cmpinfo']
  ));

}


function mylog($P){
			$myfile =fopen("aws.txt", "w");
		fwrite($myfile, $P);
		fclose($myfile);
}

$app->map(['GET','POST'],'/',function($request, $response, $args){
	
	$p = $request->getParams();
		$temp2 = array('authorization_code' => "eca8c8d7b3179b0f25a77a01682921cf817108f4",'access_token'=> "a94a8031b68f0fd6ac0a8a809ec3d99ecc309d08");
	if ($request->isPost()) {
		if(isset($p['ide'])){
			$oresponse = $response->withAddedHeader('Access-Control-Allow-Origin', '*');
			$data = json_decode(($request->getBody())->getContents(),true);
			$result = makeCodeRunRequestApi($data);
			return $oresponse->withJson($result);
		}
		else if (isset($p['login'])){
			$fp = new PDO('mysql:host=localhost;dbname=codechef', 'root', 'root');
			$fp->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$data = json_decode(($request->getBody())->getContents(),true);
			$sqlquery = "select * from LoginInfo where username=\"".$data['username']."\"";
			$user = $fp->query($sqlquery)->fetch();
			$oresponse = $response->withAddedHeader('Access-Control-Allow-Origin', '*');
			if(isset($user['username'])){
				if(md5($data['password']) == $user['password']){
					return $oresponse->withJson("ok");
				}
				else{
					return $oresponse->withJson("wrong");
				}
			}
			else{
				// $sql="INSERT INTO LoginInfo(username,password,authorization_code,access_token,refresh_token) VALUES(:username,:password,:code,:access_token,:refresh_token)";
				// $stmt = $fp->prepare($sql);
				// $stmt->bindParam(':username', $data['username']);
				// $stmt->bindParam(':password', md5($data['password']));
				// $stmt->bindParam(':code', "8934ee");
		  //       $stmt->bindParam(':access_token',"er34r");
		  //       $stmt->bindParam(':refresh_token', "erd32");
		  //       $stmt->execute();
		        return $oresponse->withJson("redirectToCodechef");
				}
		}
	} else {


	$temp = &$this->get("config");

	$this->get("config");
	if(isset($p['log'])){
		$myfile =fopen("testfile.txt", "w");
		fwrite($myfile, "scuuses");
		fclose($myfile);
		return $response;
	}

	if(isset($p['name']) && isset($p['qcode']))
	{
		$oresponse = $response->withAddedHeader('Access-Control-Allow-Origin', '*');
		$ans = makeQuestionReuqestApi($p['name'], $p['qcode'], $temp2,$temp);
		$myfile =fopen("testfile.txt", "w");
		fwrite($myfile, $p['name']);
		fclose($myfile);

		return $oresponse->withJson($ans);
	}

	if(isset($p['name']))
	{
		session_start();
		$oresponse = $response->withAddedHeader('Access-Control-Allow-Origin', '*');
		$fp = new PDO('mysql:host=localhost;dbname=codechef', 'root', 'root');
		$fp->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$users = $fp->query("Select * from LoginInfo")->fetchAll(PDO::FETCH_OBJ);
		//$temp2 = array('authorization_code' => $_SESSION['authorization_code'],'access_token'=> $_SESSION['access_token']);
		// var_dump($_SESSION);
		//var_dump($_SESSION);

		$ans =  makeContestCodeRequestApi($p['name'], $temp2, $temp);

			$myfile =fopen("testfile.txt", "w");
		fwrite($myfile, $ans);
		fclose($myfile);

		return $oresponse->withJson($ans);
	} else if (isset($p['contestDetails'])) {
		$totalRankings = make_api_request("https://api.codechef.com/rankings/".$p['contestDetails']."?fields=rank",$temp2,false);
		$object = json_decode($totalRankings, true);
		$rankings[0] = $object['result']['data']['content'][0];
		$rankings[1] = $object['result']['data']['content'][1];
		$rankings[2] = $object['result']['data']['content'][2];
		$rankings[3] = $object['result']['data']['content'][3];
		$rankings[4] = $object['result']['data']['content'][4];
		$rankings[5] = $object['result']['data']['content'][5];
		$rankings[6] = $object['result']['data']['content'][6];
		$rankings[7] = $object['result']['data']['content'][7];
		$rankings[8] = $object['result']['data']['content'][8];
		$rankings[9] = $object['result']['data']['content'][9];
		$oresponse = $response->withAddedHeader('Access-Control-Allow-Origin', '*');
		return $oresponse->withJson(json_encode($rankings));
	}
	else if(isset($p['code'])){
		session_start();	
		$_SESSION['authorization_code'] = $p['code'];
		$_SESSION['once'] = 1;
		if($_SESSION['once'] == 1){
			generate_access_token_first_time($temp, $temp2);
			$_SESSION['once'] =2;
		}
		$fp = new PDO('mysql:host=localhost;dbname=codechef', 'root', 'root');
		$fp->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$users = $fp->query("Select * from LoginInfo")->fetchAll(PDO::FETCH_OBJ);
		var_dump($_SESSION);
		$fgfg = "pd";
		$gggg = md5("as");
	    $sql="INSERT INTO LoginInfo(username,password,authorization_code,access_token,refresh_token) VALUES(:username,:password,:code,:access_token,:refresh_token)";
			$stmt = $fp->prepare($sql);
			$stmt->bindParam(':username', $fgfg);
			$stmt->bindParam(':password', $gggg);
			$stmt->bindParam(':code', $_SESSION['authorization_code']);
	        $stmt->bindParam(':access_token',$_SESSION['access_token']);
	        $stmt->bindParam(':refresh_token', $_SESSION['refresh_token']);
	        $stmt->execute();
        
		// 	$myfile =fopen("testfile.txt", "w");
		// fwrite($myfile, $fp);
		// fclose($myfile);
		//return $this->view->render($response,'showProblem.php');
		return $response->withRedirect('http://localhost:3000/?id=4532');
	}

	else{
		return $this->view->render($response,'index.php');
	}
}
});



// $app->post('/',function($request, $response){
// 	$data = $request->getParsedBody()
// 	mylog("kkk");
// 	return $response;
// 	// if (isset($p['login'])) {
// 	// 	mylog($request->getParsedBody());
// 	// 	return $response;
// 	// } 


// });


$app->run();

?>

