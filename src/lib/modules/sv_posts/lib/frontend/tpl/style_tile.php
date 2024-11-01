<article <?php echo $this->get_post_attr(); ?>>
    <?php if ( $this->show_thumbnail() ) { ?>
        <div class="sv-posts-thumbnail">
            <?php if ( $this->show_categories() ) { ?>
                <div class="sv-posts-categories">
                    <?php echo $this->get_categories( '', true ); ?>
                </div>
            <?php } ?>

            <?php if ( isset( $attr['thumbnailLink'] ) && $attr['thumbnailLink'] ) { ?>
                <a href="<?php echo $this->get_post_permalink(); ?>" class="sv-posts-thumbnail-wrapper">
                    <?php echo get_the_post_thumbnail( null, $attr['thumbnailSize'] ); ?>
                </a>
            <?php } else { ?>
                <div class="sv-posts-thumbnail-wrapper">
                    <?php echo get_the_post_thumbnail( null, $attr['thumbnailSize'] ); ?>
                </div>
            <?php } ?>
        </div>
    <?php } ?>

    <div class="sv-posts-wrapper">
        <div class="sv-posts-info">
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
            <?php } ?>
        </div>

        <?php if ( $this->show_excerpt() ) { ?>
            <?php if ( isset( $attr['thumbnailLink'] ) && $attr['thumbnailLink'] ) { ?>
                <a href="<?php echo $this->get_post_permalink(); ?>" class="sv-posts-excerpt">
                    <?php echo $this->get_excerpt(); ?>
                </a>
            <?php } else { echo $this->get_excerpt(); }?>
        <?php } ?>
    </div>
</article>