<?php

use Swagger\Client\Model\HtmlAnalysisRequest;

return [
    'licenseCode' => 'ignore',
    'languages' => [
        HtmlAnalysisRequest::LANGUAGE_EN => 'English',
        HtmlAnalysisRequest::LANGUAGE_EN_US => 'American English',
        HtmlAnalysisRequest::LANGUAGE_EN_UK => 'British English',
    ],
    'reports' => [
        'grammar',
        'core'
    ],
    'style' => 'General'
];
