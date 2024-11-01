<div class="<?php echo $this->get_wrapper_class();  ?>" <?php echo 'data-instance-id="instance_'.$this->block_attr['instance_id'].'"'; ?>>
    <?php
        $wp_query   = $this->get_custom_query();
        $count      = 0;
        $count_max  = $wp_query->post_count;
	    
        $full_path = $this->get_path( 'lib/frontend/tpl/style_' . $this->block_attr['postStyle'] . '.php' );
        $path = apply_filters($this->get_root()->get_prefix().'_filter_tpl_path', $this->block_attr['postStyle'], $full_path);

	    $attr['readMoreText'] = __($attr['readMoreText'], 'sv_posts');

	    while ( have_posts() ) {
            $count++;
            the_post();
            
            if($this->wpml->is_active() && $this->block_attr['WPMLIgnorePostLanguage'] === false ){
	            // Checks if WPML is active and if post, hast the same language like the current post
	            if ($this->wpml->get_post_language( get_the_id() ) && $this->wpml->get_current_language() !== $this->wpml->get_post_language( get_the_id() ) ) {
		            continue;
	            }
            }
		    
            if(file_exists($path)){
	            require( $path );
            }else{
                error_log('SV Posts: File not found:' .(string)$path);
            }
		    
        }
	
	    wp_reset_query();
	    wp_reset_postdata();
	    
        // When Pagination is enabled
        if ( isset( $this->block_attr['enablePagination'] ) && $this->block_attr['enablePagination'] ) {
            require( $this->get_path( 'lib/frontend/tpl/pagination.php' ) );
        }

        // When Infinite Scroll is enabled
        if ( isset( $this->block_attr['enableInfiniteScroll'] ) && $this->block_attr['enableInfiniteScroll'] ) {
            ?>
            <div class="sv-posts-infinite-scroll-loader">
                <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#000">
                    <g fill="none" fill-rule="evenodd">
                        <g transform="translate(1 1)" stroke-width="2">
                            <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                            <path d="M36 18c0-9.94-8.06-18-18-18">
                                <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 18 18"
                                        to="360 18 18"
                                        dur="1s"
                                        repeatCount="indefinite"/>
                            </path>
                        </g>
                    </g>
                </svg>
            </div>
            <?php
        }
    ?>
</div>