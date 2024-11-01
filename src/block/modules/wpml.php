<?php
namespace sv_posts;

class wpml extends block {
    protected function is_active(): bool {
		return in_array('sitepress-multilingual-cms/sitepress.php', apply_filters('active_plugins', get_option('active_plugins')));
    }

    protected function get_current_language(): string {
        return apply_filters( 'wpml_current_language', NULL );
    }

    protected function get_post_language( int $post_id ): string {
    	$lang = apply_filters( 'wpml_post_language_details', NULL, $post_id )['language_code'];

        return is_string($lang) ? $lang : '';
    }
}