#Integration

Please, pay attention that all path and url are related.
You need change them according to your site.


1. Insert widget on the page

```php

<?php 

require_once(__DIR__ . '/prowritingaid/vendor/autoload.php');
$config = require(__DIR__ . '/config.php');

?>
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
</div>

```

2. Add style

```html

<link href="/assets/dist/style.css" rel="stylesheet">

```

3. Add Scripts

```html

<script src="/assets/src/js/jquery.punctuation-checker.js?<?php time(); ?>"></script>
<script>
    $(document).ready(function () {
        $('#punctuation-checker').punctuationChecker({
            api: '/api.php',
            editorSelector: '[data-editor]',
            languageSelector: '[data-language]',
            submitSelector: '[data-submit]',
            popupCorrectionSelector: '[data-popup-correction]',
            lineHeight: 18 // px
        });
    });
</script>

```
