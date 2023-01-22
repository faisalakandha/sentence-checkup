<?php

function ti_custom_javascript()
{
?>
    <script src="<?php echo plugin_dir_url(__FILE__) ?>sentilib/assets/src/js/jquery.punctuation-checker.js?<?php time(); ?>"></script>
    <script>
        $(document).ready(function() {
            $('#punctuation-checker').punctuationChecker({
                api: '<?php echo plugin_dir_path(__FILE__) ?>sentilib/api.php',
                editorSelector: '[data-editor]',
                languageSelector: '[data-language]',
                submitSelector: '[data-submit]',
                popupCorrectionSelector: '[data-popup-correction]',
                lineHeight: 18 // px
            });
        });
    </script>

<?php

}

function my_theme_scripts()
{
    wp_enqueue_style('my-theme-styles', plugin_dir_url(__FILE__) . 'sentilib/assets/dist/style.css');
}
add_action('wp_enqueue_scripts', 'my_theme_scripts');


add_action("wp_head", "ti_custom_javascript");

?>
