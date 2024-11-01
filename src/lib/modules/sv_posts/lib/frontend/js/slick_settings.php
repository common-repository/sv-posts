window.addEventListener('load', function(){
	let slider = jQuery('.wp-block-straightvisions-sv-posts.sv-is-slider[data-instance-id="instance_<?php echo $this->block_attr['instance_id']; ?>"]');
	if(slider.length > 0){
		slider.slick({
			autoplay: <?php echo isset( $this->block_attr['slickSliderAutoplay'] ) && $this->block_attr['slickSliderAutoplay'] ? 'true' : 'false'; ?>,
			autoplaySpeed: <?php echo $this->block_attr['slickSliderAutoplaySpeed']; ?>,
			infinite: <?php echo isset( $this->block_attr['slickSliderInfinite'] ) && $this->block_attr['slickSliderInfinite'] ? 'true' : 'false'; ?>,
			centerMode: <?php echo isset( $this->block_attr['slickSliderCenterMode'] ) && $this->block_attr['slickSliderCenterMode'] ? 'true' : 'false'; ?>,
			speed: <?php echo $this->block_attr['slickSliderSpeed']; ?>,
			slidesToShow: <?php echo $this->block_attr['columns']; ?>,
			slidesToScroll: <?php echo $this->block_attr['slickSliderSlidesToScroll']; ?>,
			arrows: <?php echo isset( $this->block_attr['slickSliderArrows'] ) && $this->block_attr['slickSliderArrows'] ? 'true' : 'false'; ?>,
			dots: <?php echo isset( $this->block_attr['slickSliderDots'] ) && $this->block_attr['slickSliderDots'] ? 'true' : 'false'; ?>,
			prevArrow: '<button type="button" class="slick-prev slick-arrow" aria-label="Previous"><?php require $this->get_path( 'lib/frontend/icons/sliderPrevArrow.svg' ) ?></button>',
			nextArrow: '<button type="button" class="slick-next slick-arrow" aria-label="Previous"><?php require $this->get_path( 'lib/frontend/icons/sliderNextArrow.svg' ) ?></button>',
			mobileFirst: true,
			customPaging: function(slider, i) {
				return jQuery('<button type="button" class="slide-' + i + '" />');
			},
		});

		//console.log('SV Posts - Slick Slider <?php echo $this->block_attr['instance_id']; ?> initialized');
	}else{
		//console.log('SV Posts - Slick Slider <?php echo $this->block_attr['instance_id']; ?> not found');
	}
});