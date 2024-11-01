<?php
namespace sv_posts;

class block extends sv_posts {
	protected $block_attr 	= array();
	protected $icons		= array();

	public function init() {
		$this->init_modules()->init_icons()->register_block();

		// Actions Hooks & Filter
		add_filter( 'rest_post_query', array( $this, 'filter_rest_post_query' ), 99, 2);
		add_filter( 'rest_page_query', array( $this, 'filter_rest_post_query' ), 99, 2);
		add_filter( 'rest_post_collection_params', array( $this, 'filter_rest_post_collection' ), 99, 2);
		add_filter( 'rest_page_collection_params', array( $this, 'filter_rest_post_collection' ), 99, 2);
		add_action( 'wp_ajax_infinite_load_posts', array( $this, 'infinite_load_posts' ) );
		add_action( 'wp_ajax_nopriv_infinite_load_posts', array( $this, 'infinite_load_posts' ) );
	}

	public function init_modules(): sv_posts {
		// WPML Support
		require_once( 'modules/wpml.php' );
		$this->wpml = new wpml();

		return $this;
	}

	public function init_icons(): sv_posts {
		$this->icons['user'] 	= '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z"/></svg>';
		$this->icons['clock'] 	= '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 12v-6h-2v8h7v-2h-5z"/></svg>';
		$this->icons['archive'] = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.669 13l-1.385 9h-16.568l-1.385-9h19.338zm2.331-2h-24l2 13h20l2-13zm-20.312-8l-.688-2h17.979l-.604 2h-16.687zm.166 6l-.415-2h17.121l-.39 2h2.03l.8-4h-22l.8 4h2.054zm12.146 7c0-.552-.447-1-1-1h-6c-.553 0-1 .448-1 1s.447 1 1 1h6c.553 0 1-.448 1-1z"/></svg>';
		$this->icons['pen'] 	= '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M1.439 16.873l-1.439 7.127 7.128-1.437 16.873-16.872-5.69-5.69-16.872 16.872zm4.702 3.848l-3.582.724.721-3.584 2.861 2.86zm15.031-15.032l-13.617 13.618-2.86-2.861 10.825-10.826 2.846 2.846 1.414-1.414-2.846-2.846 1.377-1.377 2.861 2.86z"/></svg>';

		return $this;
	}

	public function render_block( array $attr ): string {
		global $wp_query;

		$orig_wp_query						= $wp_query;
		$this->block_attr					= $attr;
		$this->block_attr['instance_id']	= $this->get_parent()->create_instance_ID();

		$this->load_block_assets();
		$this->add_infinite_scroll_config();

		ob_start();
		require( $this->get_path( 'lib/frontend/tpl/loop.php' ) );

		$output = ob_get_contents();
		ob_end_clean();

		$wp_query = $orig_wp_query;

		return $output;
	}

	public function add_infinite_scroll_config(){
		global $wp_query;

		if ( isset( $this->block_attr['enableInfiniteScroll'] ) && $this->block_attr['enableInfiniteScroll'] ) {
			$new_infinite_settings		= array(
				'ajaxurl'				=> admin_url('admin-ajax.php'),
				'nonce'					=> \wp_create_nonce('infinite_scroll_load_posts'),
				'block_attr'			=> json_encode($this->block_attr),
				'posts'					=> json_encode($wp_query->query_vars),
				'current_page'			=> max(1, is_front_page() ? get_query_var('page') : get_query_var('paged')),
				'max_page'				=> $wp_query->max_num_pages,
				'can_be_loaded'			=> true
			);

			// Enqueues the Infinite Scrolling script
			$this->get_parent()->get_script('infinite')
				->set_is_enqueued()->set_localized(
					array_merge(
						$this->get_parent()->get_script('infinite')->get_localized(),
						array('instance_'.$this->block_attr['instance_id'] => $new_infinite_settings)
					)
				);
		}
	}

	public function load_block_assets() {
		if ( ! is_admin() ) {
			$post_style = 'style_' . $this->block_attr['postStyle'];

			$this->get_parent()->get_script( 'common' )->set_is_enqueued();
			$this->get_parent()->get_script( $post_style )->set_is_enqueued();

			if ( isset( $this->block_attr['slickSlider'] ) && $this->block_attr['slickSlider'] ) {
				$this->get_parent()->get_script('slick')->set_is_enqueued();
				$this->get_parent()->get_script('slick_js')->set_is_enqueued();

				$file_name	= 'slick_'.md5($_SERVER['REQUEST_URI']).'_'.$this->block_attr['instance_id'].'.js';
				$file_id	= $this->get_prefix($file_name);

				//if(strlen(get_transient($file_id)) === 0) {
					ob_start();
					require($this->get_path('lib/frontend/js/slick_settings.php'));
					$js = ob_get_clean();
					file_put_contents($this->get_path_cached($file_name), $js);
					//set_transient($file_id, $this->get_url_cached($file_name), 24 * HOUR_IN_SECONDS);
				//}
				$this->get_parent()->get_script($file_id)
					->set_path($this->get_path_cached($file_name),true, $this->get_url_cached($file_name))
					->set_type('js')
					->set_deps(array(
						'jquery',
						$this->get_parent()->get_script('slick_js')->get_handle()
					))
					->set_is_enqueued();
			}
		}
	}

	private function register_block() {
		register_block_type(
			'straightvisions/sv-posts', array(
				'editor_script' => 'sv-posts-block',
				'editor_style' => 'sv-posts-block-editor',
				'attributes' => array(
					// Style & Layout
					'align' => array(
						'type' => 'string',
						'default' => 'wide',
					),
					'postStyle' => array(
						'type' => 'string',
						'default' => 'card',
					),
					'layout' => array(
						'type' => 'string',
						'default' => 'grid',
					),
					'columns' => array(
						'type' => 'number',
						'default' => 3,
					),

					// Thumbnail
					'showThumbnail' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'thumbnailLink' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'thumbnailSize' => array(
						'type' => 'string',
						'default' => 'medium',
					),
					'thumbnailPosition'	=> array(
						'type' => 'string',
						'default' => 'top',
					),

					// Title & Content
					'contentAlign' => array(
						'type' => 'string',
					),
					'showTitle' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'titleLink' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'titleFontSize' => array(
						'type' => 'number',
					),
					'showExcerpt' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'excerptType' => array(
						'type' => 'string',
						'default' => 'excerpt',
					),
					'excerptLength' => array(
						'type' => 'number',
						'default' => 15,
					),
					'excerptFontSize' => array(
						'type' => 'number',
					),
					'showReadMore' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'readMoreText' => array(
						'type' => 'string',
						'default' => __( 'Read more', 'sv_posts' ),
					),
					'readMoreFontSize' => array(
						'type' => 'number',
					),

					// Meta
					'showAuthor' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'showDate' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'showCategories' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'metaLinkCategories' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'showEdit' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'metaFontSize' => array(
						'type' => 'number',
					),
			
					// Colors
					'backgroundColor' => array(
						'type' => 'string',
						'default' => 'transparent',
					),
					'backgroundColorClass'=> array(
						'type' => 'string',
					),
					'borderColor' => array(
						'type' => 'string',
					),
					'titleColor' => array(
						'type' => 'string',
					),
					'titleColorClass' => array(
						'type' => 'string',
					),
					'excerptColor' => array(
						'type' => 'string',
					),
					'excerptColorClass'	=> array(
						'type' => 'string',
					),
					'readMoreColor' => array(
						'type' => 'string',
					),
					'readMoreColorClass' => array(
						'type' => 'string',
					),
					'infoColor' => array(
						'type' => 'string',
					),
					'infoColorClass' => array(
						'type' => 'string',
					),
					'infoIconColor' => array(
						'type' => 'string',
					),
					'infoIconColorClass' => array(
						'type' => 'string',
					),
					'categoryColor' => array(
						'type' => 'string',
						'default' => '#000000',
					),
					'categoryColorClass'=> array(
						'type' => 'string',
					),
					'categoryBackgroundColor'		=> array(
						'type' => 'string',
						'default' => 'transparent',
					),
					'categoryBackgroundColorClass'	=> array(
						'type' => 'string',
					),

					// Border
					'borderWidthTop' => array(
						'type' => 'number',
						'default' => 0,
					),
					'borderWidthRight' => array(
						'type' => 'number',
						'default' => 0,
					),
					'borderWidthBottom' => array(
						'type' => 'number',
						'default' => 0,
					),
					'borderWidthLeft' => array(
						'type' => 'number',
						'default' => 0,
					),
					'borderRadius' => array(
						'type' => 'number',
						'default' => 5,
					),
					'borderRadiusCategory' => array(
						'type' => 'number',
						'default' => 3,
					),

					// Sorting & Filtering
					'orderBy' => array(
						'type' => 'string',
						'default' => 'date',
					),
					'order' => array(
						'type' => 'string',
						'default' => 'desc',
					),
					'postsPerPage' => array(
						'type' => 'number',
						'default' => 9,
					),
					'postsOffset' => array(
						'type' => 'number',
						'default' => 0,
					),
					'filterByAuthor' => array(
						'type' => 'number',
					),
					'filterByType' => array(
						'type' => 'string',
						'default' => 'post',
					),
					'filterByPosts' => array(
						'type' => 'string',
					),
					'enableInfiniteScroll'=> array(
						'type' => 'boolean',
					),
					'enableLinkToCategory'=> array(
						'type' => 'boolean',
					),
					'enablePagination'=> array(
						'type' => 'boolean',
					),
					'excludeCurrentPost'=> array(
						'type' => 'boolean',
						'default' => true,
					),
					'filterByThumbnail'	=> array(
						'type' => 'boolean',
						'default' => false,
					),
					'filterByCategories'=> array(
						'type' => 'boolean',
						'default' => false,
					),
					'filteredCategories'=> array(
						'type' => 'string',
					),
					'filterByDate' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'filterByDateStart'	=> array(
						'type' => 'string',
					),
					'filterByDateEnd' => array(
						'type' => 'string',
					),
					'filterByStatus' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'filteredStatus' => array(
						'type' => 'string',
						'default' => json_encode( array( 'publish' ) ),
					),

					// Slider
					'slickSlider' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'slickSliderAutoplay' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'slickSliderAutoplaySpeed' => array(
						'type' => 'number',
						'default' => 3000,
					),
					'slickSliderInfinite' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'slickSliderArrows' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'slickSliderDots' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'slickSliderCenterMode' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'slickSliderSlidesToScroll' => array(
						'type' => 'number',
						'default' => 1,
					),
					'slickSliderSpeed' => array(
						'type' => 'number',
						'default' => 500,
					),

					// Advanced
					'className' => array(
						'type' => 'string',
					),
					
					//3rd party
					'WPMLIgnorePostLanguage' => array(
						'type' => 'boolean',
						'default' => false,
					),
				),
				'render_callback'	=> array( $this, 'render_block' ),
			)
		);
	}

	// Helper Methods
	// Returns an icon
	public function get_icon( string $icon ): string {
		if ( ! isset( $this->icons[ $icon ] ) ) return '';

		return $this->icons[ $icon ];
	}

	// Returns a string with all classes for the posts wrapper
	public function get_wrapper_class(): string {
		$class 			= array();
		$class[]		= 'wp-block-straightvisions-sv-posts';

		// Post Style
		$class[]		= 'sv-posts-post-style-' . $this->block_attr['postStyle'];

		// Layout
		if ( $this->block_attr['postStyle'] === 'card' ) {
			$class[] 	= 'sv-posts-layout-' . $this->block_attr['layout'];
		}

		// Columns
		if ( $this->block_attr['postStyle'] !== 'list' ) {
			$class[] 	= 'sv-posts-layout-cols-' . $this->block_attr['columns'];
		}

		// Alignment
		if ( isset( $this->block_attr['align'] ) ) { 
			$class[] 	= 'align' . $this->block_attr['align'];
		}

		// Pagination
		if ( isset( $this->block_attr['enablePagination'] ) && $this->block_attr['enablePagination'] ) { 
			$class[] 	= 'sv-posts-is-paginated';
		}

		// Infinite Scroll
		if ( isset( $this->block_attr['enableInfiniteScroll'] ) && $this->block_attr['enableInfiniteScroll'] ) { 
			$class[] 	= 'sv-posts-is-infinite-scroll';
		}
		
		// Link to category page
		if ( isset( $this->block_attr['enableLinkToCategory'] ) && $this->block_attr['enableLinkToCategory'] ) {
			$class[] 	= 'sv-posts-is-link-to-category';
		}

		if ( isset( $this->block_attr['thumbnailPosition'] ) && $this->block_attr['thumbnailPosition'] ) {
			$class[]    = 'sv-post-thumbnail-position-' . $this->block_attr['thumbnailPosition'];
		}

		// Slick Slider
		if ( isset( $this->block_attr['slickSlider'] ) && $this->block_attr['slickSlider'] ) {
			$class[] 	= 'sv-is-slider';
		}

		// Slick Slider - Center Mode
		if ( isset( $this->block_attr['slickSliderCenterMode'] ) && $this->block_attr['slickSliderCenterMode'] ) {
			$class[] 	= 'sv-slider-center-mode';
		}

		// Additional Classes
		if ( isset( $this->block_attr['className'] ) ) { 
			$class[] 	= $this->block_attr['className'];
		}

		return implode( ' ', $class );
	}

	// Returns a string with all attributes of a single post
	public function get_post_attr(): string {
		$post = get_post(get_the_ID());
		$slug = $post->post_name;

		$attr 		= array();

		// ID
		$attr[]		= 'id="post-' . get_the_ID() . '"';

		// add slug for additional identifier (slider)
		$attr[]		= 'data-post-slug="' . $slug . '"';

		// Class
		$class		= get_post_class();

		if ( 
			isset( $this->block_attr['backgroundColor'] ) 
			&& isset( $this->block_attr['backgroundColorClass'] ) 
			&& $this->block_attr['backgroundColorClass']
		) {
            $class[] = $this->block_attr['backgroundColorClass'];
		}

		if ( 
			isset( $this->block_attr['thumbnailPosition'] ) 
			&& $this->block_attr['thumbnailPosition'] 
		) {
            $class[] = 'sv-post-thumbnail-position-' . $this->block_attr['thumbnailPosition'];
		}
		
		if (
			isset( $this->block_attr['contentAlign'] )
			&& $this->block_attr['contentAlign']
		) {
			$class[] = 'sv-post-content-align-' . $this->block_attr['contentAlign'];
		}
		
		if ( ! empty( $class ) ) {
			$attr[]	= 'class="' . implode( ' ', $class ) . '"';
		}

		// Style
		$style = array();

		// Background Color
		if ( 
			isset( $this->block_attr['backgroundColor'] ) 
			&& ( ! isset( $this->block_attr['backgroundColorClass'] ) || ! $this->block_attr['backgroundColorClass'] )
		) {
			$style[] = 'background-color:' . $this->block_attr['backgroundColor'];
		}

		// Input Border Color
		if ( isset( $this->block_attr['borderColor'] ) ) {
			$style[] = 'border-color:' . $this->block_attr['borderColor'];
		}

		// Border Radius
		if ( isset( $this->block_attr['borderRadius'] ) ) {
			$style[] = 'border-radius:' . $this->block_attr['borderRadius'] . 'px';
		}

		// Border Width Top
		if ( isset( $this->block_attr['borderWidthTop'] ) ) {
			$style[] = 'border-top-width:' . $this->block_attr['borderWidthTop'] . 'px';
		}

		// Border Width Right
		if ( isset( $this->block_attr['borderWidthRight'] ) ) {
			$style[] = 'border-right-width:' . $this->block_attr['borderWidthRight'] . 'px';
		}

		// Border Width Bottom
		if ( isset( $this->block_attr['borderWidthBottom'] ) ) {
			$style[] = 'border-bottom-width:' . $this->block_attr['borderWidthBottom'] . 'px';
		}

		// Border Width Left
		if ( isset( $this->block_attr['borderWidthLeft'] ) ) {
			$style[] = 'border-left-width:' . $this->block_attr['borderWidthLeft'] . 'px';
		}

		if ( ! empty( $style ) ) {
			$attr[] = 'style="' . implode( ';', $style ) . '"';
		}


		return implode( ' ', $attr );
	}

	private function filter_by_taxonomy_terms( array $args ): array {
		if ( ! isset( $this->block_attr['filterByCategories'] ) || ! $this->block_attr['filterByCategories'] ) return $args;
		if ( ! isset( $this->block_attr['filteredCategories'] ) || ! $this->block_attr['filteredCategories'] ) return $args;
		if ( count( json_decode( $this->block_attr['filteredCategories'] ) ) < 1  ) return $args;

		if ( $this->block_attr['filterByType'] === 'post' ) {
			$args['category__in'] = json_decode( $this->block_attr['filteredCategories'] );
		} else {
			if ( ! isset( $this->block_attr['filteredCategories'] ) || empty( $this->block_attr['filteredCategories'] ) ) return $args;
			
			$args['tax_query'] = array();
			$terms = json_decode( $this->block_attr['filteredCategories'] );
			$sorted_terms = array();

			// Sorts the terms by their taxonomy
			foreach( $terms as $term_id ) {
				$term = get_term( $term_id );
				$sorted_terms[ $term->taxonomy ][] = $term_id;
			} 

			foreach( $sorted_terms as $taxonomy => $terms ) {
				$args['tax_query'][] = array(
					'taxonomy' 	=> $taxonomy,
					'field' 	=> 'id',
					'terms' 	=> implode( ',', $terms ),
				);
			}
		}

		return $args;
	}

	public function get_custom_query_args(): array {
		$paged = max( 1, is_front_page() ? get_query_var('page') : get_query_var('paged') );
		$args = array(
			'posts_per_page'=> $this->block_attr['postsPerPage'],
			'order'			=> $this->block_attr['order'],
			'orderby'		=> $this->block_attr['orderBy'] === 'include' ? 'post__in' : $this->block_attr['orderBy'],
			'post_type'		=> $this->block_attr['filterByType'],
			'offset'		=> $this->block_attr['postsOffset'],
			'paged'			=> $paged
		);

		// Pagination
		if ( isset( $this->block_attr['enablePagination'] ) && $this->block_attr['enablePagination'] ) {
			$paged = max( 1, is_front_page() ? get_query_var('page') : get_query_var('paged') );
			$args['offset'] = ( $paged - 1 ) * $args['posts_per_page'];
		}

		// Show from Author
		if ( ! empty( $this->block_attr['filterByAuthor'] ) ) {
			$args['author'] = $this->block_attr['filterByAuthor'];
		}

		// Filter by Posts
		if ( 
			! empty( $this->block_attr['filterByPosts'] ) 
			&& count( explode( ',', $this->block_attr['filterByPosts'] ) ) > 0 
		) {
			$args['post__in'] = array_filter( array_map( 'trim', explode( ',', $this->block_attr['filterByPosts'] ) ) );
		}
		
		// Remove current post from list
		if ( empty($this->block_attr['filterByParentPost']) === false ) {
			$args['post_parent'] = (int) $this->block_attr['filterByParentPost'];
		}

		// Remove current post from list
		if ( $this->block_attr['excludeCurrentPost'] ) {
			$args['post__not_in'] = array( get_the_ID() );
		}

		// Show only posts with Thumbnail
		if ( $this->block_attr['filterByThumbnail'] ) {
			$args['meta_key'] = '_thumbnail_id';
		}

		// Filter by Categories
		$args = array_merge( $args, $this->filter_by_taxonomy_terms( $args ) );

		// Filter by Date
		if ( $this->block_attr['filterByDate'] ) {
			$date_start = array(
				'year'	=> date_parse( $this->block_attr['filterByDateStart'] )['year'],
				'month'	=> date_parse( $this->block_attr['filterByDateStart'] )['month'],
				'day'	=> date_parse( $this->block_attr['filterByDateStart'] )['day'],
			);

			$date_end = array(
				'year'	=> date_parse( $this->block_attr['filterByDateEnd'] )['year'],
				'month'	=> date_parse( $this->block_attr['filterByDateEnd'] )['month'],
				'day'	=> date_parse( $this->block_attr['filterByDateEnd'] )['day'],
			);

			$args['date_query']	= array( 
				array( 
					'after' 	=> $date_start, 
					'before' 	=> $date_end, 
					'inclusive' => true, 
				) 
			);
		}

		// Filter by Status
		if ( $this->block_attr['filterByStatus'] ) {
			$args['post_status'] = $this->block_attr['filteredStatus'];
		}

		return $args;
	}

	public function get_custom_query(): \WP_Query {
		return new \WP_Query( $this->get_custom_query_args() );
	}

	// Returns bool if thumbnail should be displayed
	public function show_thumbnail(): bool {
		if ( 
			isset( $this->block_attr['showThumbnail'] ) 
			&& $this->block_attr['showThumbnail'] 
			&& has_post_thumbnail() 
		) {
			return true;
		}

		return false;
	}

	// Returns bool if title should be displayed
	public function show_title(): bool {
		if ( ! isset( $this->block_attr['showTitle'] ) ) return false;

		return $this->block_attr['showTitle'];
	}

	// Returns a string with all attributes for the post title
	public function get_title_attr(): string {
		$attr 		= array();

		// HREF
		if ( 
			isset( $this->block_attr['titleLink'] ) 
			&& $this->block_attr['titleLink'] 
		) {
			$attr[] = 'href="' . $this->get_post_permalink() . '"';
		}

		// Class
		$class = array();

		if ( 
			isset( $this->block_attr['titleColor'] ) 
			&& $this->block_attr['titleColorClass'] 
		) {
            $class[] = $this->block_attr['titleColorClass'];
		}
		
		if ( ! empty( $class ) ) {
			$attr[]	= 'class="' . implode( ' ', $class ) . '"';
		}

		// Style
		$style = array();

		// Color
		if ( 
			isset( $this->block_attr['titleColor'] ) 
			&& ! $this->block_attr['titleColorClass'] 
		) {
			$style[] = 'color:' . $this->block_attr['titleColor'];
		}

		// Font Size
		if ( isset( $this->block_attr['titleFontSize'] ) ) {
			$style[] = 'font-size:' . $this->block_attr['titleFontSize'] . 'px';
		}

		if ( ! empty( $style ) ) {
			$attr[] = 'style="' . implode( ';', $style ) . '"';
		}

		return implode( ' ', $attr );
	}

	// Returns bool if the excerpt should be displayed
	public function show_excerpt(): bool {
		if ( ! isset( $this->block_attr['showExcerpt'] ) ) return false;

		return $this->block_attr['showExcerpt'];
	}

	// Returns the excerpt or post content as string
	public function get_excerpt(): string {
		$excerpt = '';

		if ( $this->block_attr['excerptType'] === 'full_post' ) {
			ob_start();
			the_content();
			$excerpt = ob_get_clean();
		} elseif ( str_word_count( get_the_excerpt() ) > 0 ) {
			if ( 
				isset( $this->block_attr['excerptLength'] ) 
				&& $this->block_attr['excerptLength'] 
			) {
				// override default excerpt length
				$default_excerpt_length		= apply_filters('excerpt_length', 55);
				add_filter( 'excerpt_length', function(){ return $this->block_attr['excerptLength']; }, 999 );
				$excerpt = get_the_excerpt();

				$excerpt_content = wp_trim_words( $excerpt, $this->block_attr['excerptLength'] );
				$excerpt = '<p' . $this->get_excerpt_attr() . '>' . $excerpt_content . '</p>';

				// restore default excerpt length
				add_filter( 'excerpt_length', function() use ($default_excerpt_length){ return $default_excerpt_length; }, 999 );
			}else{
				$excerpt = get_the_excerpt();
			}
		}

		return $excerpt;
	}

	// Returns a string with all attributes for the post excerpt
	public function get_excerpt_attr(): string {
		$attr 		= array();
		
		// Class
		$class		= array();

		if ( 
			isset( $this->block_attr['excerptColor'] ) 
			&& $this->block_attr['excerptColorClass'] 
		) {
            $class[] = $this->block_attr['excerptColorClass'];
		}
		
		if ( count( $class ) > 0 ) {
			$attr[]	= ' class="' . implode( ' ', $class ) . '"';
		}

		// Style
		$style = array();

		// Color
		if ( 
			isset( $this->block_attr['excerptColor'] ) 
			&& ! $this->block_attr['excerptColorClass'] 
		) {
			$style[] = 'color:' . $this->block_attr['excerptColor'] . '"';
		}

		// Font Size
		if ( isset( $this->block_attr['excerptFontSize'] ) ) {
			$style[] = 'font-size:' . $this->block_attr['excerptFontSize'] . 'px';
		}

		if ( count( $style ) > 0 ) {
			$attr[] = ' style="' . implode( ';', $style ) . '"';
		}


		return implode( ' ', $attr );
	}

	// Returns bool if the read more link should be displayed
	public function show_read_more(): bool {
		if ( 
			isset( $this->block_attr['showReadMore'] ) 
			&& $this->block_attr['showReadMore']
		) {
			return true;
		}

		return false;
	}

	// Returns a string with all attributes for the read more link
	public function get_read_more_attr(): string {
		$attr 		= array();

		// HREF
		$attr[]		= 'href="' . $this->get_post_permalink() . '"';

		// Class
		$class		= array( 'sv-posts-read-more' );

		if ( 
			isset( $this->block_attr['readMoreColor'] ) 
			&& $this->block_attr['readMoreColorClass'] 
		) {
            $class[] = $this->block_attr['readMoreColorClass'];
		}
		
		if ( ! empty( $class ) ) {
			$attr[]	= 'class="' . implode( ' ', $class ) . '"';
		}

		// Style
		$style = array();

		// Color
		if ( 
			isset( $this->block_attr['readMoreColor'] ) 
			&& ! $this->block_attr['readMoreColorClass'] 
		) {
			$style[] = 'color:' . $this->block_attr['readMoreColor'];
		}

		// Font Size
		if ( isset( $this->block_attr['readMoreFontSize'] ) ) {
			$style[] = 'font-size:' . $this->block_attr['readMoreFontSize'] . 'px';
		}

		if ( ! empty( $style ) ) {
			$attr[] = 'style="' . implode( ';', $style ) . '"';
		}

		return implode( ' ', $attr );
	}

	// Returns a string with all attributes for the info
	public function get_info_attr(): string {
		$attr 		= array();

		// Class
		$class		= array();

		if ( 
			isset( $this->block_attr['infoColor'] ) 
			&& $this->block_attr['infoColorClass'] 
		) {
            $class[] = $this->block_attr['infoColorClass'];
		}
		
		if ( ! empty( $class ) ) {
			$attr[]	= 'class="' . implode( ' ', $class ) . '"';
		}

		// Style
		$style = array();

		// Color
		if ( 
			isset( $this->block_attr['infoColor'] ) 
			&& ! $this->block_attr['infoColorClass'] 
		) {
			$style[] = 'color:' . $this->block_attr['infoColor'];
		}

		// Font Size
		if ( isset( $this->block_attr['metaFontSize'] ) ) {
			$style[] = 'font-size:' . $this->block_attr['metaFontSize'] . 'px';
		}

		if ( ! empty( $style ) ) {
			$attr[] = 'style="' . implode( ';', $style ) . '"';
		}


		return implode( ' ', $attr );
	}

	// Returns a string with all attributes for the info icons
	public function get_info_icon_attr(): string {
		$attr 		= array();

		// Class
		$class		= array();

		if ( 
			isset( $this->block_attr['infoIconColor'] ) 
			&& $this->block_attr['infoIconColorClass'] 
		) {
            $class[] = $this->block_attr['infoIconColorClass'];
		}
		
		if ( ! empty( $class ) ) {
			$attr[]	= 'class="' . implode( ' ', $class ) . '"';
		}

		// Style
		$style = array();

		// Color
		if ( 
			isset( $this->block_attr['infoIconColor'] ) 
			&& ! $this->block_attr['infoIconColorClass'] 
		) {
			$attr[] = 'color:' . $this->block_attr['infoIconColor'];
		}

		if ( ! empty( $style ) ) {
			$attr[] = 'style="' . implode( ';', $style ) . '"';
		}

		return implode( ' ', $attr );
	}

	// Returns bool if the author should be displayed
	public function show_author(): bool {
		if ( ! isset( $this->block_attr['showAuthor'] ) ) return false;

		return $this->block_attr['showAuthor'];
	}

	// Returns bool if the date should be displayed
	public function show_date(): bool {
		if ( ! isset( $this->block_attr['showDate'] ) ) return false;

		return $this->block_attr['showDate'];
	}

	// Returns bool if the categories should be displayed
	public function show_categories(): bool {
		if ( ! isset( $this->block_attr['showCategories'] ) ) return false;
		if ( empty( get_the_category() ) ) return false;

		return $this->block_attr['showCategories'];
	}

	// Returns a string with all attributes for categories
	public function get_category_attr(): string {
		$attr 		= array();

		// Class
		$class		= array();

		if ( 
			isset( $this->block_attr['categoryColor'] ) 
			&& isset( $this->block_attr['categoryColorClass']  )
			&& $this->block_attr['categoryColorClass'] 
		) {
            $class[] = $this->block_attr['categoryColorClass'];
		}

		if ( 
			isset( $this->block_attr['categoryBackgroundColor'] ) 
			&& isset( $this->block_attr['categoryBackgroundColorClass'] ) 
			&& $this->block_attr['categoryBackgroundColorClass']
		) {
            $class[] = $this->block_attr['categoryBackgroundColorClass'];
		}
		
		if ( ! empty( $class ) ) {
			$attr[]	= 'class="' . implode( ' ', $class ) . '"';
		}

		// Style
		$style = array();

		if ( 
			isset( $this->block_attr['categoryColor'] ) 
			&& ( ! isset( $this->block_attr['categoryColorClass'] ) || ! $this->block_attr['categoryColorClass'] )
		) {
			$style[] = 'color:' . $this->block_attr['categoryColor'];
		}

		if ( 
			isset( $this->block_attr['categoryBackgroundColor'] ) 
			&& ( ! isset( $this->block_attr['categoryBackgroundColorClass']  ) || ! $this->block_attr['categoryBackgroundColorClass'] )
		) {
			$style[] = 'background-color:' . $this->block_attr['categoryBackgroundColor'];
		}

		// Font Size
		if ( isset( $this->block_attr['metaFontSize'] ) ) {
			$style[] = 'font-size:' . $this->block_attr['metaFontSize'] . 'px';
		}

		// Border Radius
		if ( isset( $this->block_attr['borderRadiusCategory'] ) ) {
			$style[] = 'border-radius:' . $this->block_attr['borderRadiusCategory'] . 'px';
		}

		if ( ! empty( $style ) ) {
			$attr[] = 'style="' . implode( ';', $style ) . '"';
		}


		return implode( ' ', $attr );
	}

	// Returns the categories as string
	public function get_categories( string $seperator = ', ', bool $in_thumbnail = false ): string {
		if ( empty( get_the_category() ) ) return '';
		
		// Stores the categoriy ids of all rendered categories
		$outputted_categories 	= array();

		// Stores the html output, of the categories
		$categories_html_array	= array();

		foreach ( get_the_category() as $cat ) {
			if ( in_array( $cat->term_id, $outputted_categories ) ) continue;
			$category_html = '';

			if( $this->block_attr['metaLinkCategories'] ){
				$category_html 				= '<a href="' . esc_url( get_category_link( $cat->term_id ) ) . '" ';
				$category_html 				.= 'title="' . esc_attr( sprintf( __( 'View all posts in %s', 'sv_posts' ), $cat->name ) ) . '" ';

				if ( $in_thumbnail ) {
					$category_html 			.= $this->get_category_attr();
				} else {
					$category_html 			.= $this->get_info_attr();
				}

				$category_html 				.= '>' . esc_html( $cat->name ) . '</a>';
			}else{
				$category_html 				.= esc_html( $cat->name );
			}

			$categories_html_array[] 	= $category_html;
			$outputted_categories[]		= $cat->term_id;
		}

		return implode( $seperator, $categories_html_array );
	}
	
	// Replace post permalink with category permalink
	public function get_link_to_category_attr() {
		$output = false;
		
		if(isset($this->block_attr['enableLinkToCategory'])){
			$output = $this->block_attr['enableLinkToCategory'];
		}
		
		return $output;
	}
	
	public function get_post_permalink(){
		$permalink = get_the_permalink();
	
		if( $this->get_link_to_category_attr() === true){
			$categories = get_the_category();
			if(empty($categories) === false){
				$permalink = get_category_link($categories[0]);
			}
		}
		
		return $permalink;
	}

	// Returns bool if the edit post link should be displayed
	public function show_edit(): bool {
		if ( ! isset( $this->block_attr['showEdit'] ) || ! current_user_can( 'edit_posts' ) ) return false;

		return $this->block_attr['showEdit'];
	}

	// Loads posts for the Infinite Scroll Ajax Request
	public function infinite_load_posts() {
		if ( ! wp_verify_nonce( $_POST[ 'nonce' ], 'infinite_scroll_load_posts' ) ) die;

		$this->block_attr = $attr = json_decode( stripslashes( $_POST['block_attr'] ), true );
		//$args = json_decode( stripslashes( $_POST['query'] ), true );
		$args = $this->get_custom_query_args();
		$args['paged'] = $_POST['page'] + 1;
		$args['post_status'] = 'publish';
		$args['offset'] = ( $args['paged'] - 1 ) * $args['posts_per_page'];
		$args['post_type'] = $attr['filterByType'];
		
		query_posts( $args );

		$full_path = $this->get_path( 'lib/frontend/tpl/style_' . $attr['postStyle'] . '.php' );
		$path = apply_filters($this->get_root()->get_prefix().'_filter_tpl_path', $attr['postStyle'], $full_path);

		if( have_posts() ) {
			while( have_posts() ) { 
				the_post();
				require( $path );
			}
		}
		die;
	}

	// Supports additional arguments in the WP Rest Api Querries
	public function filter_rest_post_query( array $args, object $request ) {
		$args += array(
			'meta_key' 		=> $request['meta_key'],
			'meta_value' 	=> $request['meta_value'],
			'meta_query' 	=> $request['meta_query'],
		);

		return $args;
	}

	// Supports additional arguments in the WP Rest Api Querry Collection
	public function filter_rest_post_collection( array $args, object $request ) {
		$args['orderby']['enum'][] = 'rand';

		return $args;
	}
	
	public function get_block_attributes(){
		return $this->block_attr;
	}
	
	// 3rd party
	// WPML ------------------------------------------------------------------------------------------------------------
	public function wpml_ignore_post_language() {
		return isset($this->block_attr['WPMLIgnorePostLanguage']) ? true : false;
	}
	// WPML ------------------------------------------------------------------------------------------------------------
}