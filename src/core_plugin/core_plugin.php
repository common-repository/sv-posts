<?php
	namespace sv_core;

	require_once( 'core/core.php' );
	
	class core_plugin extends core {
		protected static $plugin_core_initialized			= false;
		
		protected function init_subcore(){
			if ( !static::$plugin_core_initialized ) {
				static::$plugin_core_initialized = true;
				
				add_action( 'admin_menu', array( $this, 'admin_menu' ), 1 );
				add_action( 'admin_menu', array( $this, 'section_menus' ), 1 );

				$this->lib_register();
			}
		}

		public function lib_register(){
			// Object Watcher
			$this->get_active_core()->get_script('object_watcher_js')
			     ->set_type('js')
			     ->set_path($this->get_url_core('../lib/object_watcher/object_watcher.min.js'));

			// Swiffy Slider
			$this->get_active_core()->get_script('swiffy')
			     ->set_type('css')
			     ->set_path($this->get_url_core('../lib/swiffy/swiffy-slider.min.css'));

			$this->get_active_core()->get_script('swiffy_js')
				->set_type('js')
				->set_path($this->get_url_core('../lib/swiffy/swiffy-slider.min.js'));

			$this->get_active_core()->get_script('swiffy_extension_js')
			     ->set_type('js')
			     ->set_path($this->get_url_core('../lib/swiffy/swiffy-slider-extensions.min.js'));
		}
		public function lib_enqueue(string $script){
			if($script === 'object_watcher'){
				$this->get_active_core()->get_script('object_watcher_js')->set_is_enqueued();
			}
			if($script === 'swiffy'){
				$this->get_active_core()->get_script('swiffy')->set_is_enqueued();
				$this->get_active_core()->get_script('swiffy_js')->set_is_enqueued();
			}
			if($script === 'swiffy_extension'){
				$this->get_active_core()->get_script('swiffy_extension_js')->set_is_enqueued();
			}
		}
		public function lib_enqueue_gutenberg(string $script){
			if($script === 'swiffy'){
				$this->get_active_core()->get_script('swiffy')->set_is_gutenberg();
				$this->get_active_core()->get_script('swiffy_js')->set_is_gutenberg();
			}
			if($script === 'swiffy_extension'){
				$this->get_active_core()->get_script('swiffy_extension_js')->set_is_gutenberg();
			}
		}

		public function admin_menu() {
			add_menu_page(
				__( 'straightvisions', 'sv_core' ),
				__( 'straightvisions', 'sv_core' ),
				'manage_options',
				'straightvisions',
				'',
				$this->get_url_core( '../assets/logo_icon.svg' ),
				100
			);
			
			add_submenu_page(
				'straightvisions',				// parent slug
				__( 'Info', 'sv_core' ),					// page title
				__( 'Info', 'sv_core' ),					// menu title
				'manage_options',					// capability
				'straightvisions',				// menu slug
				function() {								// callable function
					$this->load_page( $this->get_path_core( 'info/backend/tpl/about.php' ) );
				}
			);
		}

		public function section_menus(){
			foreach ( $this->get_instances() as $name => $instance ) {
				$instance->add_section( $instance );

				add_submenu_page(
					'straightvisions',			// parent slug
					$instance->get_section_title(),			// page title
					$instance->get_section_title(),			// menu title
					'manage_options',				// capability
					$instance->get_prefix(),				// menu slug
					function () use ( $instance ) {			// callable function
						$instance->load_page();
					}
				);
			}
		}

		public function get_module( string $name, bool $required = false ) {
			if($this->is_module_loaded($name)){
				return $this->get_modules_loaded()[$this->get_root()->get_prefix($name)];
			}

			$loaded = $this->get_root()
				->load_module(
					$name,
					$this->get_root()->get_path( 'lib/modules/'.$name ),
					$this->get_root()->get_url( 'lib/modules/'.$name ),
					$required
				);

			if($loaded){
				return $this->get_root()->get_modules_loaded()[$this->get_root()->get_prefix($name) ];
			}

			return false;
		}

		public function load_module( string $name, string $path = 'lib/modules/', string $url = 'lib/modules/', bool $required = false ): bool {
			if($this->is_module_loaded($name)){ // already loaded
				return true;
			}

			$full_path			= $this->get_root()->get_path($path) . $name . '/';
			$full_init_path		= $full_path . $name . '.php';
			$full_url			= $this->get_root()->get_url($url) . $name . '/';

			require_once( $full_init_path );

			$class_name  = $this->get_root()->get_name() . '\\' . $name;
			$this->get_root()->$name = new $class_name();
			$this->get_root()->$name
				->set_name( $this->get_root()->get_prefix( $this->get_root()->$name->get_module_name() ) )
				->set_path( $full_path )
				->set_url( $full_url )
				->set_root( $this->get_root() )
				->set_parent( $this )
				->init();

			$this->set_modules_loaded($this->get_root()->$name->get_prefix(), $this->get_root()->$name);

			return true;
		}
	}