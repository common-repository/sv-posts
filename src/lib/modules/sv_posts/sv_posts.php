<?php
namespace sv_posts;

class sv_posts extends modules {
	protected $instance_IDs = array();
	protected $lang_dir = '';
	
	public function init() {
		$this->lang_dir = 'sv-posts/languages';

		$this->register_scripts()
			->register_blocks()
			->load_plugin_translation();

		// Actions Hooks & Filter
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ), 10, 2 );
		add_action( 'init', array( $this, 'register_block_assets' ) );

		// sv_posts_filter_tpl_path
		add_filter( $this->get_root()->get_prefix().'_filter_tpl_path', array($this, 'filter_tpl_path'), 10, 2 );
	}

	public function register_scripts(): sv_posts {
		// Stylesheets
		$this->get_script( 'common' )
			 ->set_path( 'lib/frontend/css/common.css' );

		$this->get_script( 'style_list' )
			 ->set_path( 'lib/frontend/css/style_list.css' );

		$this->get_script( 'style_card' )
			 ->set_path( 'lib/frontend/css/style_card.css' );

		$this->get_script( 'style_tile' )
			 ->set_path( 'lib/frontend/css/style_tile.css' );

		$this->get_script( 'slick' )
			 ->set_path( 'lib/frontend/css/slick.css' );
		
		/* @todo Not working with register_block_type()
		$this->get_script( 'editor' )
			 ->set_path( $this->get_root()->get_path ( '../dist/blocks.editor.build.css' ), true )
			 ->set_deps( array( 'wp-edit-blocks' ) );

		// Scripts
		$this->get_script( 'blocks' )
			 ->set_path( $this->get_root()->get_path ( '../dist/blocks.build.js' ), true )
			 ->set_deps( array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ) )
			 ->set_type( 'js' );
		*/

		// Scripts
		$this->get_script( 'infinite' )
			 ->set_path( 'lib/frontend/js/infinite.js' )
			 ->set_deps( array( 'jquery' ) )
			 ->set_type( 'js' );

		$this->get_script( 'slick_js' )
			 ->set_path( 'lib/frontend/js/slick.min.js' )
			 ->set_deps( array( 'jquery' ) )
			 ->set_type( 'js' );

		return $this;
	}

	protected function check_gutenberg() {
		if(!in_array('gutenberg/gutenberg.php', apply_filters('active_plugins', get_option('active_plugins')))){
			return false;
		}

		if ( floatval( GUTENBERG_VERSION ) < 6.7 ){
			return false;
		}

		return true;
	}

	public function register_block_assets() {	
		wp_register_script(
			'sv-posts-block',
			$this->get_root()->get_url( '../dist/blocks.build.js' ),
			array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ),
			filemtime( $this->get_root()->get_path( '../dist/blocks.build.js' ) ),
			true
		);

		// Loads the ${domain}-${locale}-${handle}.json file, for block translation in the editor
		wp_set_script_translations( 'sv-posts-block', 'sv_posts', $this->lang_dir );

		if ( $this->check_gutenberg() ) {
			wp_localize_script( 'sv-posts-block', 'gutenbergPlugin', array( 'version' => GUTENBERG_VERSION ) );
		}
	
		wp_register_style(
			'sv-posts-block-editor',
			$this->get_root()->get_url( '../dist/blocks.editor.build.css' ),
			array( 'wp-edit-blocks' ),
			filemtime( $this->get_root()->get_path( '../dist/blocks.editor.build.css' ) )
		);
	}

	private function register_blocks(): sv_posts {
		$dir = $this->get_root()->get_path();
		$dir_array = array_diff( scandir( $dir ), array( '..', '.' ) );
	
		foreach( $dir_array as $key => $value ) {
			if ( 
				is_dir( $dir . '/' . $value ) 
				&& file_exists( $dir . '/' . $value . '/index.php' ) 
			) {
				$class_name = 'sv_posts\\' . $value;

				require_once( $dir . '/' . $value . '/index.php' );

				$this->$value = new $class_name();
				$this->$value->set_root( $this->get_root() );
				$this->$value->set_parent( $this );
				$this->$value->init();
			}
		}

		return $this;
	}
	
	public function register_block_category( $categories ) {
		$category_slugs = wp_list_pluck( $categories, 'slug' );

		return 
		in_array( 'straightvisions', $category_slugs, true ) 
		? $categories 
		: array_merge(
			$categories,
			array(
				array(
					'slug' 	=> 'straightvisions',
					'title' => 'straightvisions',
				),
			)
		);
	}

	public function create_instance_ID(): int{
		return $this->instance_IDs[] = count($this->instance_IDs) + 1;
	}

	public function load_plugin_translation() {
		load_plugin_textdomain( 'sv_posts', false, $this->lang_dir );
		
		return $this;
	}

	public function filter_tpl_path(string $style_name, string $full_path){
		return $full_path;
	}
}