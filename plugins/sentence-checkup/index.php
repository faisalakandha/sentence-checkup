<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Punctuationcheck</title>

    <link href="/assets/dist/style.css?<?php time(); ?>" rel="stylesheet">
    <link href="/assets/dist/deep_check.css?<?php time(); ?>" rel="stylesheet">

    <style>
        *:focus,
        .btn:focus,
        .btn.focus,
        .btn:active:focus,
        .btn:active.focus,
        .btn.active:focus,
        .btn.active.focus,
        button:focus,
        textarea:focus {
            outline: none;
            box-shadow: none;
        }

        .container {
            width: 100%;
            max-width: 1140px;
            margin: 0 auto;
        }
    </style>
</head>

<body>
<?php

require_once(__DIR__ . '/prowritingaid/vendor/autoload.php');
$config = require(__DIR__ . '/config.php');

?>

<main role="main" class="container">
    <div id="punctuation-checker">
        <div class="editor-wrapper has-block-loader">
            <div contenteditable="true" spellcheck="false" class="editor empty"
                 data-editor
                 data-placeholder="Enter or paste text here to check"
                 data-error=""
            ></div>
        </div>

        <div class="controls">
            <div class="language-wrapper">
                <label for="pwa-language" class="">Language:</label>
                <select id="pwa-language" data-language>
                    <?php foreach ($config['languages'] as $langCode => $langName) : ?>
                        <option value="<?php echo $langCode; ?>">
                            <?php echo $langName; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <button class="check" data-deep-check style="margin-left: 10px">Deep Check</button>
            <button class="check" data-submit>Check</button>
        </div>

        <div class="pwa-popup-correction" data-popup-correction>
            <div class="pwa-popup-correction-inner">
                <div class="pwa-popup-header"></div>
                <div class="pwa-popup-body"></div>
                <div class="pwa-popup-footer">
                    <a class="pwa-ignore-button pwa-popup-footer-button" href="#" data-emit-event="ignore">
                        Ignore
                    </a>
                </div>
            </div>
        </div>

        <form data-form-deep-check
              action='https://prowritingaid.com//en/affiliate/LandingAnalyse'
              method='post'
              style="display: none">
            <textarea name='text'></textarea>
            <input type='hidden' name='afid' value='5178'>
            <button type='submit'>Check Text</button>
        </form>
    </div>
</main>

<script src="/assets/dist/jquery.js?1"></script>
<script src="/assets/src/js/jquery.punctuation-checker.js?1"></script>
<script src="/assets/src/js/jquery.punctuation-deep-check.js?1"></script>
<script>
    $(document).ready(function () {
        jQuery('#punctuation-checker').punctuationChecker({
            api: '/api.php',
            editorSelector: '[data-editor]',
            languageSelector: '[data-language]',
            submitSelector: '[data-submit]',
            popupCorrectionSelector: '[data-popup-correction]',
            lineHeight: 18 // px
        });

        jQuery('#punctuation-checker').punctuationDeepCheck({
            editorSelector: '[data-editor]',
            submitSelector: '[data-deep-check]',
            formSelector: '[data-form-deep-check]',
        });
    });
</script>
</body>
</html>

