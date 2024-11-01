const { isResolving, getEntityRecords } = wp.data.select('core');

export default ( { props } ) => {
    const { __ } = wp.i18n;
    const { 
        PanelBody, 
        BaseControl,
        TextControl,
        SelectControl,
        ToggleControl,
        CheckboxControl,
        RangeControl,
        DatePicker,
	    ComboboxControl,
    } = wp.components;
    
    const { 
        authors,
        postTypes,
        categories,
        setAttributes,
        attributes: {
            postsPerPage,
            postsOffset,
            orderBy,
            order,
            filterByAuthor,
            filterByType,
	        filterByParentPost,
            filterByPosts,
            enableInfiniteScroll,
            enableLinkToCategory,
            enablePagination,
            excludeCurrentPost,
            filterByThumbnail,
            filterByCategories,
            filteredCategories,
            filterByDate,
            filterByDateStart,
            filterByDateEnd,
            filterByStatus,
            filteredStatus,
            // 3rd party
            WPMLIgnorePostLanguage,
        }
    } = props;

    const currentDateStart  = new Date( new Date().setUTCHours( 0, 0, 0, 0 ) ).toISOString().split('.')[0]+'Z';
    const currentDateEnd    = new Date( new Date().setUTCHours( 23, 59, 59, 0 ) ).toISOString().split('.')[0]+'Z';

    // Returns a list of authors as select options
    function getAuthorsOptions() {
        let options = [{ label: __( 'All', 'sv_posts' ), value: '' }];

        if ( ! authors.isRequesting && authors.data !== undefined && authors.data.length > 0 ) {
            authors.data.map( author => {
                options.push( { label: author.name, value: author.id } );
            } );
        }

        return options;
    }

    // Returns a list of orderBy as select options
    function getOrderByOptions() {
        let orderByOptions = [
            { label: __( 'Date', 'sv_posts' ), value: 'date' },
            { label: __( 'Title', 'sv_posts' ), value: 'title' },
            { label: __( 'Author', 'sv_posts' ), value: 'author' },
            { label: __( 'Updated', 'sv_posts' ), value: 'modified' },
            { label: __( 'Random', 'sv_posts' ), value: 'rand' },
            { label: __( 'Menu Order', 'sv_posts' ), value: 'menu_order' }
        ];

        if ( filterByPosts ) {
            orderByOptions.push( { label: __( 'Order from "Filter by Post ID\'s"', 'sv_posts' ), value: 'include' } );
        }

        return orderByOptions;
    }

    // Returns a list of post types as select options
    function getPostTypesOptions( filter = [] ) {
        let options = [];

        if ( ! postTypes.isRequesting && postTypes.data != undefined && postTypes.data != null && postTypes.data.length > 0 ) {
            postTypes.data.map( type => {
                if ( filter.length > 0 ) {
                    if ( ! filter.includes( type.slug ) ) {
                        options.push( { label: type.name, value: type.slug } );
                    }
                } else {
                    options.push( { label: type.name, value: type.slug } );
                }
            } );
        }

        return options;
    }
    
    // returns list of posts
	function getPostOptions( postType = 'post' ) {
		let options = [];
		const posts = getPosts(postType);

		if ( posts.isRequesting === false ) {
			if(posts.data != null){
				posts.data.map( post => {
					options.push( { label: post.title.rendered, value: post.id } );
				} );
			}
		}
		
		return options;
	}
	
	function getPosts( postType = 'post' ){
		let args = {
			orderby: 'title',
			per_page: -1,
			type: postType
		};
	
		return {
			data: getEntityRecords( 'postType', postType, args ),
			isRequesting: isResolving( 'core', 'getEntityRecords', [ 'postType', postType, args ] )
		};
	}

    // Returns the status filter as array
    function getFilteredCategories() {
        if ( ! filteredCategories ) return [];

        return JSON.parse( filteredCategories );
    }

    // Returns the updated status filter as JSON string
    function getUpdatedFilteredCategories( cat = false ) {
        if ( ! cat ) return filteredCategories;

        let clone = getFilteredCategories();
        
        clone.includes( cat ) ? clone.splice( clone.indexOf( cat ), 1 ) : clone.push( cat );

        return JSON.stringify( clone );
    }

    // Returns the status filter as array
    function getFilteredStatus() {
        return JSON.parse( filteredStatus );
    }

    // Returns the updated status filter as JSON string
    function getUpdatedFilteredStatus( status = false ) {
        if ( ! status ) return filteredStatus;

        let clone = getFilteredStatus();
        
        clone.includes( status ) ? clone.splice( clone.indexOf( status ), 1 ) : clone.push( status );

        return JSON.stringify( clone );
    }

    return(
        <PanelBody 
            title={ __( 'Sorting & Filtering', 'sv_posts' ) }
            initialOpen={ false }
        >
            <SelectControl 
                label={ __( 'Order by', 'sv_posts' ) }
                value={ orderBy }
                options={ getOrderByOptions() }
                onChange={ ( value ) => setAttributes( { orderBy: value } ) }
            />
            <SelectControl 
                label={ __( 'Order', 'sv_posts' ) }
                value={ order }
                options={ [
                    { label: __( 'Descending', 'sv_posts' ), value: 'desc' },
                    { label: __( 'Ascending', 'sv_posts' ), value: 'asc' },
                ] }
                onChange={ ( value ) => setAttributes( { order: value } ) }
            />
            <RangeControl
                label={ __( 'Number of items', 'sv_posts' ) }
                value={ postsPerPage }
                onChange={ ( value ) => setAttributes( { postsPerPage: value } ) }
                min={ 1 }
                max={ 100 }
            />
            <RangeControl
                label={ __( 'Offset posts', 'sv_posts' ) }
                value={ postsOffset }
                onChange={ ( value ) => setAttributes( { postsOffset: value } ) }
                min={ 0 }
                max={ 10 }
            />
            <SelectControl 
                label={ __( 'Show from Author', 'sv_posts' ) }
                value={ filterByAuthor }
                options={ getAuthorsOptions() }
                onChange={ ( value ) => setAttributes( { filterByAuthor: value } ) }
            />
            <SelectControl 
                label={ __( 'Filter by Post Type', 'sv_posts' ) }
                value={ filterByType }
                options={  getPostTypesOptions() }
                onChange={ ( value ) => { 
                    setAttributes( { filterByType: value } );
                    setAttributes( { filterByCategories: false } );
                    setAttributes( { filteredCategories: '' } );
                }}
            />
            {
	            filterByType != null ?
		            <ComboboxControl
			            label={ __( 'Filter by Parent Post', 'sv_posts' ) }
			            value={ filterByParentPost }
			            options={  getPostOptions(filterByType) }
			            onChange={ ( value ) => {
				            setAttributes( { filterByParentPost: value } );
			            }}
		            />
                 : null
                
            }
	        
            <TextControl
                label={ __( 'Filter by Post ID\'s', 'sv_posts' ) }
                type='text'
                help={ __( 'Seperate Post ID\'s with commas.' ) }
                value={ filterByPosts }
                onChange={ ( value ) => setAttributes( { filterByPosts: value } ) }
            />
            <ToggleControl
                label={ __( 'Enable Infinite Scroll', 'sv_posts' ) }
                checked={ enableInfiniteScroll }
                onChange={ () => { 
                    setAttributes( { enableInfiniteScroll: ! enableInfiniteScroll } );

                    if ( ! enableInfiniteScroll ) {
                        setAttributes( { enablePagination: false } );
                    }
                }}
            />
            <ToggleControl
                label={ __( 'Enable Pagination', 'sv_posts' ) }
                checked={ enablePagination }
                onChange={ () => { 
                    setAttributes( { enablePagination: ! enablePagination } );
                    
                    if ( ! enablePagination ) {
                        setAttributes( { enableInfiniteScroll: false } );
                    }
                }}
            />
            <ToggleControl
                label={ __( 'Remove current post from list', 'sv_posts' ) }
                checked={ excludeCurrentPost }
                onChange={ () => setAttributes( { excludeCurrentPost: ! excludeCurrentPost } ) }
            />
            <ToggleControl
                label={ __( 'Show only posts with Thumbnail', 'sv_posts' ) }
                checked={ filterByThumbnail }
                onChange={ () => setAttributes( { filterByThumbnail: ! filterByThumbnail } ) }
            />
            <ToggleControl
                label={ __( 'Link post to category page', 'sv_posts' ) }
                checked={ enableLinkToCategory }
                onChange={ () => {
                    setAttributes( { enableLinkToCategory: ! enableLinkToCategory } );
                }}
            />
            <ToggleControl
                label={ __( 'WPML - Ignore post language', 'sv_posts' ) }
                checked={ WPMLIgnorePostLanguage }
                onChange={ () => {
                    setAttributes( { WPMLIgnorePostLanguage: ! WPMLIgnorePostLanguage } );
                }}
            />

            <ToggleControl
                label={ __( 'Filter by Taxonomy Terms', 'sv_posts' ) }
                checked={ filterByCategories }
                onChange={ () => setAttributes( { filterByCategories: ! filterByCategories } ) }
            />
            {
                categories && filterByCategories ?
                Object.keys(categories).map( taxonomy => {
                    return (
                        <div className="sv-posts-terms">
                            <label className="sv-posts-taxonomy-label">{ taxonomy }</label>
                            { 
                                categories[ taxonomy ] ?
                                    categories[ taxonomy ].map( term => {
                                    return(
                                        <CheckboxControl
                                            label={ term.name }
                                            checked={ getFilteredCategories().includes( term.id ) }
                                            onChange={ () => setAttributes( { filteredCategories: getUpdatedFilteredCategories( term.id ) } ) }
                                        />
                                    ) 
                                    } ) 
                                : null
                            }
                        </div>
                    )
                } )
                : null
            }
            <ToggleControl
                label={ __( 'Filter by Date', 'sv_posts' ) }
                checked={ filterByDate }
                onChange={ () => { 
                    setAttributes( { filterByDate: ! filterByDate } )

                    if ( ! filterByDate ) {
                        setAttributes( { filterByDateStart: currentDateStart } )
                        setAttributes( { filterByDateEnd: currentDateEnd } )
                    }
                } }
            />
            {
                filterByDate ? [
                    <BaseControl label={ __( 'Start', 'sv_posts' ) }>
                        <DatePicker
                            currentDate={ filterByDateStart }
                            onChange={ ( currentDate ) => setAttributes( { filterByDateStart: currentDate } ) }
                        />
                    </BaseControl>,
                    <BaseControl label={ __( 'End', 'sv_posts' ) }>
                        <DatePicker
                            currentDate={ filterByDateEnd }
                            onChange={ ( currentDate ) => setAttributes( { filterByDateEnd: currentDate } ) }
                        />
                    </BaseControl>
                ] : null
            }
            <ToggleControl
                label={ __( 'Filter by Status', 'sv_posts' ) }
                checked={ filterByStatus }
                onChange={ () => setAttributes( { filterByStatus: ! filterByStatus } ) }
            />
            {
                filterByStatus ? [
                    <CheckboxControl
                        label={ __( 'Publish', 'sv_posts' ) }
                        checked={ getFilteredStatus().includes( 'publish' ) }
                        onChange={ () => setAttributes( { filteredStatus: getUpdatedFilteredStatus( 'publish' ) } ) }
                    />,
                    <CheckboxControl
                        label={ __( 'Future', 'sv_posts' ) }
                        checked={ getFilteredStatus().includes( 'future' ) }
                        onChange={ () => setAttributes( { filteredStatus: getUpdatedFilteredStatus( 'future' ) } ) }
                    />,
                    <CheckboxControl
                        label={ __( 'Pending', 'sv_posts' ) }
                        checked={ getFilteredStatus().includes( 'pending' ) }
                        onChange={ () => setAttributes( { filteredStatus: getUpdatedFilteredStatus( 'pending' ) } ) }
                    />,
                    <CheckboxControl
                        label={ __( 'Draft', 'sv_posts' ) }
                        checked={ getFilteredStatus().includes( 'draft' ) }
                        onChange={ () => setAttributes( { filteredStatus: getUpdatedFilteredStatus( 'draft' ) } ) }
                    />,
                    <CheckboxControl
                        label={ __( 'Private', 'sv_posts' ) }
                        checked={ getFilteredStatus().includes( 'private' ) }
                        onChange={ () => setAttributes( { filteredStatus: getUpdatedFilteredStatus( 'private' ) } ) }
                    />,
                    <CheckboxControl
                        label={ __( 'Trash', 'sv_posts' ) }
                        checked={ getFilteredStatus().includes( 'trash' ) }
                        onChange={ () => setAttributes( { filteredStatus: getUpdatedFilteredStatus( 'trash' ) } ) }
                    />
                ] : null
            }
        </PanelBody>
    );
}