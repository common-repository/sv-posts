// ### Required Components ###
import iconUser from '../../icons/user';
import iconClock from '../../icons/clock';

export default ( { props, post } ) => {
    // ### Variables ###
    // Block Properties
    const { 
        authors,
        categories,
        attributes: {
            // Thumbnail
            showThumbnail,
            thumbnailSize,

            // Title & Content
            contentAlign,
            showTitle,
            titleLink,
            titleFontSize,
            showExcerpt,
            excerptType,
            excerptLength,
            excerptFontSize,

            // Meta
            showAuthor,
            showDate,
            showCategories,
            metaLinkCategories,
            metaFontSize,

            // Colors
            backgroundColor,
            backgroundColorClass,
            titleColor,
            titleColorClass,
            excerptColor,
            excerptColorClass,
            infoColor,
            infoColorClass,
            infoIconColor,
            infoIconColorClass,
            categoryColor,
            categoryColorClass,
            categoryBackgroundColor,
            categoryBackgroundColorClass,
            borderColor,

            // Border Settings
            borderWidthTop,
            borderWidthRight,
            borderWidthBottom,
            borderWidthLeft,
            borderRadius,
            borderRadiusCategory,
        }
    } = props;

    // Article Classes
    const hasPostThumbnail = post.featured_media ? 'has-post-thumbnail' : '';
    const classes = [
        post.type,
        'type-' + post.type,
        'status-' + post.status,
        'format-' + post.format,
        hasPostThumbnail,
        backgroundColorClass,
    ];
    const style = {
        backgroundColor:    backgroundColor, 
        borderColor:        borderColor,
        borderTopWidth:     borderWidthTop,
        borderRightWidth:   borderWidthRight,
        borderBottomWidth:  borderWidthBottom,
        borderLeftWidth:    borderWidthLeft,
        borderRadius:       borderRadius,
        textAlign:          contentAlign,
    };
    let sortedCategories = [];

    if ( categories ) {
        Object.keys( categories ).map( taxonomy => {
            if ( categories[taxonomy] ) {
                sortedCategories = [...sortedCategories, ...categories[taxonomy]];
            }
        } );
    }

    // ### Conditional Components ###
    const Thumbnail = () => {
        if ( ! post.featured_media || ! showThumbnail ) return null;

        const media = wp.data.select('core').getMedia( post.featured_media );

        if ( ! media ) return null;

        const classes = 'attachment-' + thumbnailSize + ' size-' + thumbnailSize + ' wp-post-image';
        let img = false;

        if ( media.media_details.sizes && media.media_details.sizes[ thumbnailSize ] ) {
            const size  = media.media_details.sizes[ thumbnailSize ];
            img = <img width={ size.width } height={ size.height } src={ size.source_url } className={ classes } />;
        } else if ( media.source_url ) {
            img = <img src={ media.source_url } className={ classes } />;
        } else {
            return null;
        }

        if ( ! img ) return null;

        return <a href='#'>{ img }</a>;
    };

    const Title = () => {
        if ( ! post.title || ! showTitle ) return null;

        return (
            <div className="sv-posts-title" style={{ textAlign: contentAlign }}>
                {
                    titleLink ?
                    <a href='#' 
                        className={ titleColorClass } 
                        style={{ color: titleColor, fontSize: titleFontSize }}
                    >
                        { post.title.raw }
                    </a>
                    :
                    <span className={ titleColorClass } 
                        style={{ color: titleColor, fontSize: titleFontSize }}
                    >
                        { post.title.raw }
                    </span>
                }
            </div>
        );
    };

    const Excerpt = () => {
        let excerpt             = '';
        const excerptElement    = document.createElement( 'div' );

        switch ( excerptType ) {
            case 'excerpt':
                excerpt                     = (post.excerpt && post.excerpt.raw.length > 0 ) ? post.excerpt.raw : post.content.raw;
                excerptElement.innerHTML    = excerpt;
                excerpt                     = excerptElement.textContent || excerptElement.innerText || '';

                if ( excerptLength < excerpt.trim().split( ' ' ).length ) {
                    excerpt = excerpt.trim().split( ' ', excerptLength ).join( ' ' ) + ' ...\n';
                } else {
                    excerpt = excerpt.trim().split( ' ', excerptLength ).join( ' ' );
                }
                break;
            case 'full_post':
                excerpt                     = post.content.raw;
                excerptElement.innerHTML    = excerpt;
                excerpt                     = excerptElement.textContent || excerptElement.innerText || '';
                excerpt                     = excerpt.trim();
                break;
        }

        return showExcerpt ? excerpt : null;
    };

    const PostContent = () => {

        return (
            <div className="sv-posts-excerpt">
                <p className={ excerptColorClass } style={{ color: excerptColor, fontSize: excerptFontSize }}>
                    <Excerpt />
                </p>
            </div>
        );
    };

    const MetaAuthor = () => {
        if ( authors === null || authors === undefined || authors.isRequesting || authors.data === null || authors.data === undefined || authors.data.length < 1 || ! showAuthor ) return null;

        const author = authors.data.find( author => {
            return author.id === post.author;
        } );

        if ( ! author ) return null;

        return (
            <div className="sv-posts-author">
                <i className={ infoIconColorClass } style={{ color: infoIconColor }}>{ iconUser }</i>
                <a href='#' 
                    className={ infoColorClass } 
                    style={{ color: infoColor, fontSize: metaFontSize }}
                >
                    { author.name }
                </a>
            </div>
        );
    };

    const MetaCategories = () => {
        if ( ! post.categories || post.categories.length < 1 || ! categories || ! showCategories ) return null;

        let output              = [];
        let counter             = 0;
        let outputtedCategories = [];

        post.categories.map( id => {
            if ( ! outputtedCategories.includes( id ) ) {
                const category = sortedCategories.find( cat => {
                    return cat.id === id;
                } );
                
                if ( category && category.link ) {
                    let catStyle = { 
                        color: categoryColor,
                        backgroundColor: categoryBackgroundColor,
                        fontSize: metaFontSize,
                        borderRadius: borderRadiusCategory,
                    };

                    if( metaLinkCategories ){
                        output.push(
                            <a href='#'
                               className={[ categoryColorClass, categoryBackgroundColorClass ]}
                               style={ style }
                            >
                                { category.name }
                            </a>
                        );
                    }else{
                        output.push(
                            category.name
                        );
                    }

                }

                counter++;

                counter < post.categories.length ? output.push( '' ) : null;

                outputtedCategories.push( id );
            } else {
                if ( output[ output.length - 1 ] === ',' ) {
                    output.pop();
                }
            }
        } );

        return (
            <div className="sv-posts-categories">
                { output }
            </div>
        );
    };

    const MetaDate = () => {
        if ( ! post.date || ! showDate ) return null;

        const formatedDate = new Date( post.date ).toLocaleDateString();

        return (
            <div className="sv-posts-date">
                <i className={ infoIconColorClass } style={{ color: infoIconColor }}>{ iconClock }</i>
                <a href='#' 
                    className={ infoColorClass } 
                    style={{ color: infoColor, fontSize: metaFontSize }}
                >
                    { formatedDate }
                </a>
            </div>
        );
    };

    return(
        <article id={ 'post-' + post.id } className={ classes.join(' ') } style={ style }>
            <div className="sv-posts-thumbnail">
                <MetaCategories />
                <Thumbnail />
            </div>
            <div className="sv-posts-wrapper">
                <div className="sv-posts-info">
                    <Title />
                    <MetaAuthor />
                    <MetaDate />
                </div>
                <PostContent />
            </div>
        </article>
    );
}