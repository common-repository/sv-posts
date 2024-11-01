<?php
	$color = esc_attr( $props['value'] ? $this->get_rgb( $props['value']) : $props['default_value'] );

	if(isset($this->run_type()->get_palette_colors()[$color])){
		$color = $this->run_type()->get_palette_colors()[$color];
	}
?>
<script>
	<?php if(strpos($props['ID'], 'sv_form_field_index') === false){ ?>
	jQuery( document ).ready( function() {
		if ( typeof SVColorPicker !== 'undefined' ) {
			SVColorPicker.renderColorPicker( '<?php echo $props['ID']; ?>', '<?php echo $color ? $color : '0,0,0,0'; ?>', <?php echo json_encode(wp_get_global_settings(array('color','palette','theme'))); ?> );
		}
	} );
	<?php }else{ // @todo: Support for cloned draft fields ?>
	
	<?php } ?>
</script>
<div class="sv_setting_color_display" title="<?php echo __( 'Toggle Color Picker', 'sv_core' ); ?>">
	<div class="sv_setting_color_value" style="background-color:rgba(<?php echo $color; ?>)"></div>
</div>
<label for="<?php echo $props['ID']; ?>" class="sv_input_label_color sv_hidden">
	<input
		data-sv_type="sv_form_field"
		class="sv_input"
		id="<?php echo $props['ID']; ?>"
		name="<?php echo $props['name']; ?>"
		type="color"
		value="<?php echo $color; ?>"
	/>
</label>