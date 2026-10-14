<?php
/**
 * Zayt Café — serve the bilingual home page at /ar/ as well as at /.
 * zayt.js reads the path to pick the language and switches it in place with history.pushState.
 */
add_action('init', function () {
    add_rewrite_rule('^ar/?$', 'index.php', 'top'); // static front page is resolved from an empty query
});
// WordPress would otherwise redirect /ar/ back to the front page URL.
add_filter('redirect_canonical', function ($redirect_url, $requested_url) {
    $path = trailingslashit((string) wp_parse_url($requested_url, PHP_URL_PATH));
    return substr($path, -4) === '/ar/' ? false : $redirect_url;
}, 10, 2);
// Flush the rewrite rules once (instead of on every request).
add_action('init', function () {
    if (get_option('zayt_ar_route') !== '1') {
        flush_rewrite_rules();
        update_option('zayt_ar_route', '1');
    }
}, 99);
