import List from './post_styles/style_list';
import Card from './post_styles/style_card';
import Tile from './post_styles/style_tile';

export default ( { props } ) => {
    const { 
        className,
        attributes: { 
            // Style & Layout
            postStyle,
            layout,
            columns,
            align,
            enablePagination,
            enableInfiniteScroll,
            enableLinkToCategory
        }
    } = props;

    let classes = className + ' sv-posts-post-style-' + postStyle;

    if ( postStyle === 'card' ) {
        classes += ' sv-posts-layout-' + layout;
    }

    if ( postStyle !== 'columns' ) {
        classes += ' sv-posts-layout-cols-' + columns;
    }

    if ( align ) {
        classes += ' align' + align;
    }

    if ( enablePagination ) {
        classes += ' sv-posts-is-paginated';
    }

    if ( enableInfiniteScroll ) {
        classes += ' sv-posts-is-infinite-scroll';
    }

    if ( enableLinkToCategory ) {
        classes += ' sv-posts-is-link-to-category';
    }

    return(
        <div className={ classes }>
        {
            props.posts.data.map( post => {
                switch( postStyle ) {
                    case 'list': return ( <List props={ props } post={ post } /> );
                    case 'card': return ( <Card props={ props } post={ post } /> );
                    case 'tile': return ( <Tile props={ props } post={ post } /> );
                }
            } ) 
        }
        </div>
    );
}