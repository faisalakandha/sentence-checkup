<?php

header('Content-Type: application/json');

use Swagger\Client\Api\HtmlApi;
use Swagger\Client\Configuration;
use Swagger\Client\Model\HtmlAnalysisRequest;

require_once(__DIR__ . '/prowritingaid/vendor/autoload.php');
$settings = require(__DIR__ . '/config.php');

$config = new Configuration();
$config->setApiKey('licenseCode', $settings['licenseCode']);
$config->setHost('https://api.prowritingaid.com');
$api = new HtmlApi(null, $config, null);
$request = new HtmlAnalysisRequest();
$text = isset($_REQUEST['text']) ? trim($_REQUEST['text']) : '';
$language = isset($_REQUEST['language']) ? trim($_REQUEST['language']) : '';
$textChecked = '';

// Allow request only from our server
if (empty($_SERVER['HTTP_REFERER'])
    || !preg_match('/^https?\:\/\/' . $_SERVER['SERVER_NAME'] .'/', $_SERVER['HTTP_REFERER'])
) {
    echo json_encode(['status' => 503, 'response' => 'Permission denied']);
    die();
}

if (empty(trim(str_replace(['&nbsp;', '<br>', '<br/>', ' '], '', strip_tags($text))))) {
    echo json_encode(['status' => 400, 'response' => 'Enter text to check']);
    die();
}

if (!array_key_exists($language, $settings['languages'])) {
    echo json_encode(['status' => 400, 'response' => 'Wrong language to checking']);
    die();
}

$request->setHtml($text);
$request->setReports($settings['reports']);
$request->setStyle($settings['style']);
$request->setLanguage($language);

try {
    $response = $api->post($request);
    print(json_encode(['status' => 200, 'response' => $response->getResult()->getHtml()]));
} catch (Exception $e) {
    print(json_encode(['status' => 400, 'response' => $e->getMessage()]));
}
die();