jQuery( document ).ready( function() {
	// Defining own Namespace and properties
	jQuery.SVPosts = jQuery.SVPosts || {};
	jQuery.SVPosts.infiniteScroll = jQuery.SVPosts.infiniteScroll || {};
	jQuery.SVPosts.infiniteScroll.data = js_sv_posts_sv_posts_scripts_infinite;

	// Functions
	// Checks distance between Posts Block and Bottom
	jQuery.SVPosts.infiniteScroll.checkDistance = function ( data ) {
		const bottomOffset = 50;
		const block = jQuery( '.wp-block-straightvisions-sv-posts.sv-posts-is-infinite-scroll[data-instance-id="'+data['instance_id']+'"]' );
		let distanceToBottom =  jQuery( window ).height() - ( block.offset().top + block.outerHeight() );

		if ( distanceToBottom > ( bottomOffset * -1 ) && jQuery.SVPosts.infiniteScroll.data[data['instance_id']].can_be_loaded ) {
			jQuery.when( jQuery.SVPosts.infiniteScroll.loadPosts( data ) ).then( function() {
				jQuery.SVPosts.infiniteScroll.checkDistance( data )
			} );
		}
	};

	// Loads posts in the Posts Block
	jQuery.SVPosts.infiniteScroll.loadPosts = function ( data ) {
		return(
			jQuery.ajax({
				url : jQuery.SVPosts.infiniteScroll.data[data.instance_id].ajaxurl,
				data: data,
				type: 'POST',
				beforeSend: function() {
					jQuery.SVPosts.infiniteScroll.data[data.instance_id].can_be_loaded = false;
					jQuery( '.wp-block-straightvisions-sv-posts.sv-posts-is-infinite-scroll[data-instance-id="'+data['instance_id']+'"] .sv-posts-infinite-scroll-loader' ).show();
				},
				success: function( response ) {
					if ( response ) {
						jQuery( '.wp-block-straightvisions-sv-posts.sv-posts-is-infinite-scroll[data-instance-id="'+data['instance_id']+'"]' ).find( 'article:last-of-type' ).after( response );

						jQuery.SVPosts.infiniteScroll.data[data.instance_id].can_be_loaded = true;
						jQuery.SVPosts.infiniteScroll.data[data.instance_id].current_page++;
					}
				},
				complete: function(){
					jQuery( '.wp-block-straightvisions-sv-posts.sv-posts-is-infinite-scroll[data-instance-id="'+data['instance_id']+'"] .sv-posts-infinite-scroll-loader' ).hide();
				}
			})
		);
	};

	// Eventlistener
	jQuery('.sv-posts-is-infinite-scroll').each(function( index ) {
		const instance_id													= jQuery(this).data('instance-id');
		jQuery.SVPosts.infiniteScroll.data[instance_id].can_be_loaded		= true;

		const data = {
			'action'			: 'infinite_load_posts',
			'nonce'				: jQuery.SVPosts.infiniteScroll.data[instance_id].nonce,
			'block_attr'		: jQuery.SVPosts.infiniteScroll.data[instance_id].block_attr,
			'query'				: jQuery.SVPosts.infiniteScroll.data[instance_id].posts,
			'page'				: jQuery.SVPosts.infiniteScroll.data[instance_id].current_page,
			'instance_id'		: instance_id
		};

		jQuery.SVPosts.infiniteScroll.checkDistance( data );

		jQuery( window ).scroll( function() {
			const bottomOffset = 1500;
			const data = {
				'action'		: 'infinite_load_posts',
				'nonce'			: jQuery.SVPosts.infiniteScroll.data[instance_id].nonce,
				'block_attr'	: jQuery.SVPosts.infiniteScroll.data[instance_id].block_attr,
				'query'			: jQuery.SVPosts.infiniteScroll.data[instance_id].posts,
				'page'			: jQuery.SVPosts.infiniteScroll.data[instance_id].current_page,
				'instance_id'	: instance_id
			};

			if( jQuery( window ).scrollTop() > ( jQuery( window ).height() - bottomOffset ) && jQuery.SVPosts.infiniteScroll.data[data['instance_id']].can_be_loaded ) {
				jQuery.SVPosts.infiniteScroll.loadPosts( data );
			}
		} );
	});
} );