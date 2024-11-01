<?php

namespace sv_core;

class setting_color extends settings {
	public static $initialized = false;
	private $parent = false;
	private $color_palette = false;
	
	public function __construct( $parent = false ) {
		$this->parent = $parent;
		
		if ( static::$initialized === false ) {
			static::$initialized = true;
			add_action( 'after_setup_theme', array( $this, 'after_setup_theme' ) );
		}
	}
	
	public function get_css_data( string $custom_property = '', string $prefix = 'rgba(', string $suffix = ')' ): array {
		$property   = ( ( strlen( $custom_property ) > 0 ) ? $custom_property : 'color' );
		$properties = array();
		
		$data = $this->get_parent()->get_data();
		if ( $data && is_array( $data ) ) {
			$val = $this->get_parent()->get_data();
			array_walk( $val, array( $this, 'replace_color_slug_to_code' ) );
			$properties[ $property ] = $this->prepare_css_property_responsive( $val, $prefix, $suffix );
		} elseif ( $data && is_string( $data ) ) {
			$val = str_replace( array_flip( $this->get_palette_colors() ), $this->get_palette_colors(), $this->get_parent()->get_data() );
			$properties[ $property ] = $this->prepare_css_property( $val, $prefix, $suffix );
		}
		
		return $properties;
	}
	
	// Returns the color pallete

	public function get_palette_colors(): array {
		$c = array();
		
		if ( ! $this->is_instance_active( 'sv100' ) ) {
			return $c;
		}
		
		if ( ! $this->get_instance( 'sv100' )->is_module_loaded( 'sv_colors' ) ) {
			return $c;
		}

        //@todo make sure functions return expected datatype and not mixed (false)
		$colors = $this->get_instance( 'sv100' )->get_module( 'sv_colors' )->get_list();

		if( is_array( $colors ) ) {
            // resort colors array for easier search
            foreach ( $colors as $color ) {
                $c[ $color['slug'] ] = $this->get_rgb( $color['color'] );
            }
		}

		return $c;
	}
	
	// Sets the color palette, if available

	public function load_color_picker() {
		// This setting is a child of a setting group
		if ( $this->get_parent()->get_module_name() === 'setting_group' ) {
			$this->load_child_setting_color_picker();
		} // Normal setting
		else {
			$this->localize_script( $this->get_parent()->get_field_id(), $this->get_parent()->get_data() );
		}
	}
	
	// Runs through a settings groups entries, checks if they have
	// a color input inside and replaces them with the react-color picker

	protected function load_child_setting_color_picker() {
		$data = $this->get_parent()->get_parent()->get_data();
		
		// Checks if the setting group got entries
		if ( $data && is_array( $data ) ) {
			// Loops through the entries
			foreach ( $data as $key => $setting ) {
				$children = $this->get_parent()->get_children();
				
				// Loops through settings of the entry
				foreach ( $children as $child ) {
					// Checks if the setting is a color setting
					if ( $child->get_type() === 'setting_color' ) {
						$field_id = $child->get_parent()->get_parent()->get_field_id();
						$ID       = $field_id . '[' . $key . '][' . $child->get_ID() . ']';
						$data     = get_option( $field_id )[ $key ][ $child->get_ID() ] ? get_option( $field_id )[ $key ][ $child->get_ID() ] : '';
						
						$this->localize_script( $ID, $data );
					}
				}
			}
		}
	}
	
	// Replaces the default color input, with the react-color picker

	public function localize_script( $ID, $data ) {
		$this->get_active_core()->get_script( 'sv_core_color_picker' )->set_localized( array_merge( $this->get_active_core()->get_script( 'sv_core_color_picker' )->get_localized(), array(
						'color_palette' => $this->get_color_palette(),
						$ID             => $data,
					) ) );
	}
	
	protected function get_color_palette() {
		return $this->color_palette;
	}
	
	protected function set_color_palette() {
		if ( get_theme_support( 'editor-color-palette' ) ) {
			$this->color_palette = get_theme_support( 'editor-color-palette' )[0];
		}
		
		return $this;
	}
	
	// save color slug instead of color code if a palette color is selected

	public function after_setup_theme() {
		$this->set_color_palette();
		
		if ( is_admin() ) {
			add_action( 'sv_core_module_scripts_loaded', array( $this, 'load_color_picker' ) );
		}
	}
	
	public function field_callback( $input ) {
		if ( ! $this->is_instance_active( 'sv100' ) ) {
			return $input;
		}
		
		if ( ! $this->get_instance( 'sv100' )->is_module_loaded( 'sv_colors' ) ) {
			return $input;
		}
		
		if ( empty($this->get_palette_colors()) ) {
			return $input;
		}
		
		// input is string
		if ( is_string( $input ) ) {
			return str_replace( array_flip(array_flip($this->get_palette_colors())), array_flip( $this->get_palette_colors() ), $input );
		}
		
		if ( is_array( $input ) ) {
			array_walk( $input, array( $this, 'replace_color_code_to_slug' ) );
		}
		
		return $input;
	}
	
	public function replace_color_code_to_slug( &$input ){
		if(is_admin() && isset($_POST['sv100_sv_colors_settings_colors_palette'])){
			// do nothing
		}else{
            $input = strtr( $input, array_combine(array_flip(array_flip($this->get_palette_colors())), array_flip( $this->get_palette_colors() )) );
        }
	}
	
	public function replace_color_slug_to_code( &$input ){
		if(is_admin() && isset($_POST['sv100_sv_colors_settings_colors_palette'])){
            // do nothing
		}else{
			$input	= strtr( $input, array_combine(array_flip( $this->get_palette_colors() ), array_flip(array_flip( $this->get_palette_colors() ))) );
        }
	}
}