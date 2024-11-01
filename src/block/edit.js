import BlockControls from './components/block_controls';
import InspectorControls from './components/inspector_controls';
import PostListComponent from './components/post_list';

const { withSelect } = wp.data;
const { Fragment } = wp.element;

const PostList = ( props ) => {
	const {__} = wp.i18n;
	const {Placeholder} = wp.components;
	
	// Loading posts
	if (props.posts.isRequesting) {
		return (
			<Fragment>
				<InspectorControls props={props}/>
				<Placeholder label={__('Loading posts...', 'sv_posts')}/>
			</Fragment>
		);
	}
	
	// No posts found
	if (props.posts.data === null || props.posts.data === undefined || props.posts.data.length < 1) {
		return (
			<Fragment>
				<InspectorControls props={props}/>
				<Placeholder label={__('No posts found', 'sv_posts')}/>
			</Fragment>
		);
	}
	
	// Found posts
	return (
		<Fragment>
			<InspectorControls props={props}/>
			{
				typeof gutenbergPlugin !== 'undefined' ?
					<BlockControls props={props}/>
					: null
			}
			<PostListComponent props={props}/>
		</Fragment>
	);
};

export default withSelect( ( select, props ) => {
    const { 
        getEntityRecords,
        getTaxonomy,
        getPostTypes,
        getUsers, 
    } = select( 'core' );

    const { isResolving } = select( 'core/data' );

    const { 
        attributes: {
            postsPerPage,
            postsOffset,
            order,
            orderBy,
            excludeCurrentPost,
            filterByThumbnail,
            filterByStatus,
            filteredStatus,
            filterByType,
            filterByAuthor,
            filterByCategories,
            filteredCategories,
            filterByPosts,
            filterByParentPost,
            filterByDate,
            filterByDateStart,
            filterByDateEnd,
        } 
    } = props;

    // Returns an array of post ID's when this filter is set
    function getFilterByPosts() {
        if ( filterByPosts && filterByPosts.split( ',' ).length > 0 ) {
            return filterByPosts.split( ',' ).filter( ( el ) => {
                return /\S/.test( el );
            } );
        } else {
            return [];
        }
    }

    // Returns all available post types, but filters them
    function getFilteredPostTypes() {
    	const postTypesData = getPostTypes({ per_page: -1 });
        const postTypes = {
            data: postTypesData != null  ? postTypesData : [] ,
            isRequesting: isResolving( 'core', 'getPostTypes' )
        };
	
        let filteredPostTypes = [];

        if ( ! postTypes.isRequesting && postTypes.data && postTypes.data.length > 0 ) {
            // @todo Replace filtering the result with filtering via query args, if available in getPostTypes() Method.
            for ( let key in postTypes.data ) {
                filteredPostTypes[ key ] = postTypes.data[ key ];
                /* The following line will filter the post types
                if ( 
                    postTypes[ key ].viewable 
                    && postTypes[ key ].supports.hasOwnProperty( 'editor' ) 
                    && postTypes[ key ].supports.editor
                ) {
                    filteredPostTypes[ key ] = postTypes[ key ];
                }
                */
            }
        }

        postTypes.data = filteredPostTypes;

        return postTypes;
    }

    // Returns the categories for this post type
    function getCategories( filteredPostTypes ) {
        let categories = {};
        
        if ( filterByType === 'post' ) {
            categories.Categories = getEntityRecords( 'taxonomy', 'category', {per_page:-1} );
        } else if ( ! filteredPostTypes.isRequesting ) {
            const selectedPostType = filteredPostTypes.data.filter( type => {
                return type.slug === filterByType;
            } );

            if ( selectedPostType.length < 1 ) return categories;
            if ( selectedPostType[0].taxonomies.length < 1 ) return categories;

            const terms = getTermsFromCPT( selectedPostType[0] );

            categories = terms;
        }

        return categories;
    }

    // Returns the custom taxonomy terms of a custom post type
    function getTermsFromCPT( postType ) {
        let terms = {};

        postType.taxonomies.map( slug => {
            const taxonomy = getTaxonomy( slug );

            if ( ! taxonomy ) return terms;

            const entities = getEntityRecords('taxonomy', slug);

            if ( entities && entities.length > 0 ) {
                terms[ taxonomy.name ] = entities;
            }
        } );

        return terms;
    }

    // Sets the filter for taxonomy terms in the editor
    function setTaxonomyFilter(args, taxonomies, terms) {
        terms.map( term => {
            Object.keys(taxonomies).map( tax => {
                if ( taxonomies[tax] ) {
                    const result = taxonomies[tax].filter( t => {
                        return t.id === term;
                    } );
                    
                    if ( result.length > 0 ) {
                        const taxonomy = result[0].taxonomy === 'category' ? 'categories' : result[0].taxonomy;
    
                        if ( args[taxonomy] ) {
                            args[taxonomy].push(term);
                        } else {
                            args[taxonomy] = [term];
                        }
                    }
                }
            } );
        } );

        return args;
    }

    // Returns posts
    function getPosts() {
        let args = {
            order: order,
            orderby: orderBy,
            per_page: postsPerPage,
            author: filterByAuthor,
            offset: postsOffset
	        /*
	        context
			page
			per_page
			search
			after
			author
			author_exclude
			before
			exclude
			include
			offset
			order
			orderby
			slug
			status
			categories
			categories_exclude
			tags
			tags_exclude
			sticky
	         */
        };

        // @notice Replace when WP REST API support random order for custom post types
	    if ( filterByType !== 'page' && filterByType !== 'post' && orderBy === 'rand' ) {
		    args.orderby = 'date';
	    }

        // Excludes the current post
        if ( excludeCurrentPost ) {
            const post_id = wp.data.select('core/editor').getCurrentPostId();
            
            if ( post_id ) {
                args.exclude = post_id;
            }
        }

        // Includes posts by their ID's
        if ( filterByPosts ) {
            args.include = getFilterByPosts();
        }
        
        //
	    if ( filterByParentPost != null ) {
		    args.parent = parseInt(filterByParentPost);
	    }

        // Filter by Taxonomy Terms
        if ( 
            filterByCategories
            && filteredCategories
            && JSON.parse( filteredCategories ).length > 0
            && Object.keys(getCategories( getFilteredPostTypes() )).length > 0
        ) {
            args = setTaxonomyFilter(args, getCategories( getFilteredPostTypes() ), JSON.parse( filteredCategories ));
        }

        // Filter by Date
        if ( filterByDate ) {
            if ( filterByDateStart ) {
                args.after = new Date( new Date( filterByDateStart ).setUTCHours( 0, 0, 0, 0 ) ).toISOString().split('.')[0]+'Z';
            }

            if ( filterByDateEnd ) {
                args.before = new Date( new Date( filterByDateEnd ).setUTCHours( 23, 59, 59, 0 ) ).toISOString().split('.')[0]+'Z';
            }
        }

        // Filter by Status
        if ( filterByStatus ) {
            args.status = filteredStatus;
        }

        // Show only posts with Thumbnail
        if ( filterByThumbnail ) {
            args.meta_key = '_thumbnail_id';
        }

        // Gets the posts
        let posts = {
            data: getEntityRecords( 'postType', filterByType, args ),
            isRequesting: isResolving( 'core', 'getEntityRecords', [ 'postType', filterByType, args ] )
        };

        return posts;
    }

    const authors ={
        data: getUsers({ roles: 'administrator, editor, author' }),
        isRequesting: isResolving( 'core', getUsers({ roles: 'administrator, editor, author' }) )
    };

    return {
        posts: getPosts(),
        categories: getCategories( getFilteredPostTypes() ),
        authors: authors,
        postTypes: getFilteredPostTypes(),
    }
})(PostList);