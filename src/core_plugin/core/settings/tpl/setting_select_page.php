<label for="<?php echo $props['ID']; ?>">
<?php
	$args		= array(
		'echo'					=> 0,
		'selected'				=> $props['value'],
		'name'					=> $props['name'],
		'id'					=> $props['ID'],
		'class'					=> 'data_sv_type_sv_form_field sv_input',
		'show_option_none'		=> __('No Page selected', 'sv_core'),
		'post_status'			=> 'publish,private',
	);
	echo wp_dropdown_pages($args);
?>
</label>