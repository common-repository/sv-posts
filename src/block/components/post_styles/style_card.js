// ### Required Components ###
import iconUser from '../../icons/user';
import iconClock from '../../icons/clock';
import iconArchive from '../../icons/archive';
import iconPen from '../../icons/pen';

const { __ } = wp.i18n;

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
            thumbnailPosition,

            // Title & Content
            contentAlign,
            showTitle,
            titleLink,
            titleFontSize,
            showExcerpt,
            excerptType,
            excerptLength,
            excerptFontSize,
            showReadMore,
            readMoreText,
            readMoreFontSize,

            // Meta
            showAuthor,
            showDate,
            showCategories,
            metaLinkCategories,
            showEdit,
            metaFontSize,

            // Colors
            backgroundColor,
            backgroundColorClass,
            titleColor,
            titleColorClass,
            excerptColor,
            excerptColorClass,
            readMoreColor,
            readMoreColorClass,
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
        'sv-post-thumbnail-position-' + thumbnailPosition,
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

        return (
            <div className="sv-posts-thumbnail">
                <MetaCategories />
                <a href='#'>{ img }</a>
            </div>
        );
    };

    const Title = () => {
        if ( ! post.title || ! showTitle ) return null;
        
        return (
            <div className="sv-posts-title">
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

    const ReadMore = () => {
        if ( ! showReadMore ) return null;

        return (
            <a href='#' 
                className={ [ 'sv-posts-read-more', readMoreColorClass ].join(' ') } 
                style={{ color: readMoreColor, fontSize: readMoreFontSize }}
            >
                { readMoreText }
            </a>
        );
    };

    const PostContent = () => {

        return (
            <div className="sv-posts-excerpt">
                <p className={ excerptColorClass } 
                    style={{ color: excerptColor, fontSize: excerptFontSize }}
                >
                    <Excerpt />
                    <ReadMore />
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

    const MetaCategories = ({ seperator, showIcon }) => {
        if ( ! post.categories || post.categories.length < 1 || ! categories || ! showCategories ) return null;

        let output              = [];
        let counter             = 0;
        let outputtedCategories = [];
        const icon              = <i className={ infoIconColorClass } style={{ color: infoIconColor }}>{ iconArchive }</i>;

        post.categories.map( id => {
            if ( ! outputtedCategories.includes( id ) ) {
                const category = sortedCategories.find( cat => {
                    return cat.id === id;
                } );
                
                if ( category && category.link ) {
                    let catStyle = { 
                        color: infoColor,
                        fontSize: metaFontSize 
                    };

                    if ( ! post.featured_media ) {
                        if( metaLinkCategories ){
                            output.push(
                                <a href='#'
                                   className={ infoColorClass }
                                   style={ catStyle }
                                >
                                    { category.name }
                                </a>
                            );
                        }else{
                            output.push(
                                category.name
                            );
                        }

                    } else {
                        catStyle.color = categoryColor;
                        catStyle.backgroundColor = categoryBackgroundColor;
                        catStyle.borderRadius = borderRadiusCategory;

                        if( metaLinkCategories ){
                            output.push(
                                <a href='#'
                                   className={[ categoryColorClass, categoryBackgroundColorClass ]}
                                   style={ catStyle }
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
                }

                counter++;

                counter < post.categories.length ? output.push( seperator ? seperator : '' ) : null;

                outputtedCategories.push( id );
            } else {
                if ( output[ output.length - 1 ] === ',' ) {
                    output.pop();
                }
            }
        } );

        return (
            <div className="sv-posts-categories">
                { showIcon ? icon : null }
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
                <a href='#' className={ infoColorClass } style={{ color: infoColor, fontSize: metaFontSize }}>{ formatedDate }</a>
            </div>
        );
    };

    const MetaEdit = () => {
        if ( ! showEdit ) return null;

        return (
            <div className="sv-posts-edit">
                <i className={ infoIconColorClass } style={{ color: infoIconColor }}>{ iconPen }</i>
                <a href='#' className={ infoColorClass } style={{ color: infoColor, fontSize: metaFontSize }}>
                    { __( 'Bearbeiten', 'sv_posts' ) }
                </a>
            </div>
        );
    };

    return(
        <article id={ 'post-' + post.id } className={ classes.join(' ') } style={ style }>
            <Thumbnail />
            <div className="sv-posts-wrapper">
                <Title />
                <PostContent />
                <div className="sv-posts-info">
                    <MetaAuthor />
                    {
                        ! showThumbnail || ! post.featured_media 
                        ? <MetaCategories seperator=',' showIcon={ true } />
                        : null
                    }
                    <MetaDate />
                    <MetaEdit />
                </div>
            </div>
        </article>
    );
}