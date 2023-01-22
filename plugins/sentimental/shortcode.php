<?php

require_once(plugin_dir_path(__FILE__) . 'sentilib/prowritingaid/autoload.php');

function sentimental_shortcode()
{
    $config = require(plugin_dir_path(__FILE__) . 'sentilib/config.php');
    ob_start();
?>

    <div id="punctuation-checker">
        <div class="editor-wrapper has-block-loader">
            <div contenteditable="true" spellcheck="false" class="editor empty" data-editor data-placeholder="Enter or paste text here to check" data-error=""></div>
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

<?php

    $content = ob_get_contents();
    ob_end_clean();
    return $content;
}

add_shortcode('sentimental_view', 'sentimental_shortcode');

?>