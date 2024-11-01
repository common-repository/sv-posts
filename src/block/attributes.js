const { __ } = wp.i18n;

export default ({
		// Style & Layout ------------------------------------------------------------
		align: {
			type: 'string',
			default: 'wide',
		},
		postStyle: {
			type: 'string',
			default: 'card',
		},
		layout: {
			type: 'string',
			default: 'grid',
		},
		columns: {
			type: 'number',
			default: 3,
		},
		
		// Thumbnail ------------------------------------------------------------
		showThumbnail: {
			type: 'boolean',
			default: true,
		},
		thumbnailLink: {
			type: 'boolean',
			default: true,
		},
		thumbnailSize: {
			type: 'string',
			default: 'medium',
		},
		thumbnailPosition: {
			type: 'string',
			default: 'top',
		},
		
		// Title & Content ------------------------------------------------------------
		contentAlign: {
			type: 'string',
		},
		showTitle: {
			type: 'boolean',
			default: true,
		},
		titleLink: {
			type: 'boolean',
			default: true,
		},
		titleFontSize: {
			type: 'number',
		},
		showExcerpt: {
			type: 'boolean',
			default: true,
		},
		excerptType: {
			type: 'string',
			default: 'excerpt',
		},
		excerptLength: {
			type: 'number',
			default: 15,
		},
		excerptFontSize: {
			type: 'number',
		},
		showReadMore: {
			type: 'boolean',
			default: true,
		},
		readMoreText: {
			type: 'string',
			default: __( 'Read more', 'sv_posts' ),
		},
		readMoreFontSize: {
			type: 'number',
		},
		
		// Meta ------------------------------------------------------------
		showAuthor: {
			type: 'boolean',
			default: true,
		},
		showDate: {
			type: 'boolean',
			default: true,
		},
		showCategories: {
			type: 'boolean',
			default: true,
		},
		metaLinkCategories: {
			type: 'boolean',
			default: true,
		},
		showEdit: {
			type: 'boolean',
			default: true,
		},
		metaFontSize: {
			type: 'number',
		},
		
		// Colors ------------------------------------------------------------
		backgroundColor: {
			type: 'string',
			default: 'transparent',
		},
		backgroundColorClass: {
			type: 'string',
		},
		borderColor: {
			type: 'string',
		},
		titleColor: {
			type: 'string',
		},
		titleColorClass: {
			type: 'string',
		},
		excerptColor: {
			type: 'string',
		},
		excerptColorClass: {
			type: 'string',
		},
		readMoreColor: {
			type: 'string',
		},
		readMoreColorClass: {
			type: 'string',
		},
		infoColor: {
			type: 'string',
		},
		infoColorClass: {
			type: 'string',
		},
		infoIconColor: {
			type: 'string',
		},
		infoIconColorClass: {
			type: 'string',
		},
		categoryColor: {
			type: 'string',
			default: '#000000',
		},
		categoryColorClass: {
			type: 'string',
		},
		categoryBackgroundColor: {
			type: 'string',
			default: 'transparent',
		},
		categoryBackgroundColorClass: {
			type: 'string',
		},
		
		// Border Settings ------------------------------------------------------------
		borderWidthTop: {
			type: 'number',
			default: 0,
		},
		borderWidthRight: {
			type: 'number',
			default: 0,
		},
		borderWidthBottom: {
			type: 'number',
			default: 0,
		},
		borderWidthLeft: {
			type: 'number',
			default: 0,
		},
		borderRadius: {
			type: 'number',
			default: 5,
		},
		borderRadiusCategory: {
			type: 'number',
			default: 3,
		},
		
		// Sorting & Filtering ------------------------------------------------------------
		orderBy: {
			type: 'string',
			default: 'date',
		},
		order: {
			type: 'string',
			default: 'desc',
		},
		postsPerPage: {
			type: 'number',
			default: 9,
		},
		postsOffset: {
			type: 'number',
			default: 0,
		},
		filterByAuthor: {
			type: 'number',
		},
		filterByType: {
			type: 'string',
			default: 'post',
		},
		filterByPosts: {
			type: 'string',
		},
		filterByParentPost: {
			type: 'number',
		},
		enableInfiniteScroll: {
			type: 'boolean',
		},
		enableLinkToCategory: {
			type: 'boolean',
		},
		enablePagination: {
			type: 'boolean',
		},
		excludeCurrentPost: {
			type: 'boolean',
			default: 'true',
		},
		filterByThumbnail: {
			type: 'boolean',
			default: false,
		},
		filterByCategories: {
			type: 'boolean',
			default: false,
		},
		filteredCategories: {
			type: 'string',
		},
		filterByDate: {
			type: 'boolean',
			default: false,
		},
		filterByDateStart: {
			type: 'string',
		},
		filterByDateEnd: {
			type: 'string',
		},
		filterByStatus: {
			type: 'boolean',
			default: false,
		},
		filteredStatus: {
			type: 'string',
			default: JSON.stringify( [ 'publish' ] ),
		},
		
		// Slider ------------------------------------------------------------
		slickSlider: {
			type: 'boolean',
			default: false,
		},
		slickSliderAutoplay: {
			type: 'boolean',
			default: false,
		},
		slickSliderAutoplaySpeed: {
			type: 'number',
			default: 3000,
		},
		slickSliderInfinite: {
			type: 'boolean',
			default: true,
		},
		slickSliderArrows: {
			type: 'boolean',
			default: true,
		},
		slickSliderDots: {
			type: 'boolean',
			default: true,
		},
		slickSliderCenterMode: {
			type: 'boolean',
			default: false,
		},
		slickSliderSlidesToScroll: {
			type: 'number',
			default: 1,
		},
		slickSliderSpeed: {
			type: 'number',
			default: 500,
		},
		
		// Advanced ------------------------------------------------------------
		className: {
			type: 'string',
		},
		
		// 3rd Party ------------------------------------------------------------
		// WPML
		WPMLIgnorePostLanguage:{
			type: 'boolean',
			default: false,
		},
});