<article <?php echo $this->get_post_attr(); ?>>
    <?php if ( $this->show_thumbnail() ) { ?>
        <div class="sv-posts-thumbnail">
            <?php if ( isset( $attr['thumbnailLink'] ) && $attr['thumbnailLink'] ) { ?>
                <a href="<?php echo $this->get_post_permalink(); ?>">
                    <?php echo get_the_post_thumbnail( null, $attr['thumbnailSize'] ); ?>
                </a>
            <?php } else { ?>
                <?php echo get_the_post_thumbnail( null, $attr['thumbnailSize'] ); ?>
            <?php } ?>
        </div>
    <?php } ?>

    <div class="sv-posts-wrapper">
        <?php if ( $this->show_title() ) { ?>
            <div class="sv-posts-title">
                <?php if ( isset( $attr['titleLink'] ) && $attr['titleLink'] ) { ?>
                    <a <?php echo $this->get_title_attr(); ?>>
                        <?php echo get_the_title(); ?>
                    </a>
                <?php } else { ?>
                    <span <?php echo $this->get_title_attr(); ?>>
                            <?php echo get_the_title(); ?>
                    </span>
                <?php } ?>
            </div>
        <?php } ?>
	
	    <?php if ( $this->show_excerpt() || $this->show_read_more()) { ?>
            <div class="sv-posts-excerpt">
			    <?php
				    echo $this->show_excerpt() ? $this->get_excerpt() : '';
				    if ( $this->show_read_more() ) {
					    ?>
                        <a <?php echo $this->get_read_more_attr(); ?>>
						    <?php echo $attr['readMoreText']; ?>
                        </a>
				    <?php } ?>
            </div>
	    <?php } ?>
        <?php
            if (
            $this->show_author()
            || $this->show_date()
            || $this->show_categories()
            || $this->show_edit()
            ){ ?>
            <div class="sv-posts-info">
                <?php if ( $this->show_author() ) { ?>
                    <div class="sv-posts-author">
                        <i <?php echo $this->get_info_icon_attr(); ?>>
                            <?php echo $this->get_icon('user'); ?>
                        </i>
                        <a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ) ); ?>"
                            <?php echo $this->get_info_attr(); ?>
                        >
                            <?php echo get_the_author_meta( 'display_name' ); ?>
                        </a>
                    </div>
                <?php } if ( $this->show_date() ) { ?>
                    <div class="sv-posts-date">
                        <i <?php echo $this->get_info_icon_attr(); ?>>
                            <?php echo $this->get_icon('clock'); ?>
                        </i>
                        
                        <a href="<?php echo $this->get_post_permalink(); ?>" <?php echo $this->get_info_attr(); ?>>
                            <?php echo get_the_date(); ?>
                        </a>
                    </div>
                <?php } if ( $this->show_categories() ) { ?>
                    <div class="sv-posts-categories">
                        <i <?php echo $this->get_info_icon_attr(); ?>>
                            <?php echo $this->get_icon('archive'); ?>
                        </i>
                        <?php echo $this->get_categories(); ?>
                    </div>
                <?php } if ( $this->show_edit() ) { ?>
                    <div class="sv-posts-edit">
                        <i <?php echo $this->get_info_icon_attr(); ?>>
                            <?php echo $this->get_icon('pen'); ?>
                        </i>
                        <a href="<?php echo get_edit_post_link(); ?>"
                            <?php echo $this->get_info_attr(); ?>
                        >
                            <?php _e( 'Edit', 'sv_posts' ); ?>
                        </a>
                    </div>
                <?php } ?>
            </div>
        <?php } ?>
    </div>
</article>