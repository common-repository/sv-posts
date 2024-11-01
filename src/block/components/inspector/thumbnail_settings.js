const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { 
    PanelBody, 
    ToggleControl,
    SelectControl,
} = wp.components;

export default ( { props } ) => {
    if ( ! props ) return '';

    // Block Attributes
    const { 
        setAttributes,
        attributes: {
            postStyle,
            showThumbnail,
            thumbnailLink,
            thumbnailSize,
            thumbnailPosition,
        }
    } = props;

    return(
        <PanelBody 
            title={ __( 'Thumbnail', 'sv_posts' ) }
            initialOpen={ false }
        >
            <ToggleControl
                label={ __( 'Thumbnail', 'sv_posts' ) }
                checked={ showThumbnail }
                onChange={ () => setAttributes( { showThumbnail: ! showThumbnail } ) }
            />
            {
                showThumbnail ? [
                    <Fragment>
                    {
                        postStyle === 'card' ? 
                            <SelectControl 
                                label={ __( 'Thumbnail Position', 'sv_posts' ) }
                                value={ thumbnailPosition }
                                options={ [
                                    { label: __( 'Above', 'sv_posts' ), value: 'top' },
                                    { label: __( 'Left', 'sv_posts' ), value: 'left' },
                                    { label: __( 'Right', 'sv_posts' ), value: 'right' },
                                    { label: __( 'Below', 'sv_posts' ), value: 'bottom' },
                                ] }
                                onChange={ ( value ) => setAttributes( { thumbnailPosition: value } ) }
                            />
                            : null
                    }
                    </Fragment>,
                    <SelectControl 
                        label={ __( 'Thumbnail Size', 'sv_posts' ) }
                        value={ thumbnailSize }
                        options={ [
                            { label: __( 'Thumbnail', 'sv_posts' ), value: 'thumbnail' },
                            { label: __( 'Medium', 'sv_posts' ), value: 'medium' },
                            { label: __( 'Medium Large', 'sv_posts' ), value: 'medium_large' },
                            { label: __( 'Large', 'sv_posts' ), value: 'large' },
                            { label: __( 'Full Size', 'sv_posts' ), value: 'full' },
                        ] }
                        onChange={ ( value ) => setAttributes( { thumbnailSize: value } ) }
                    />,
                    <ToggleControl
                        label={ __( 'Link thumbnail to post', 'sv_posts' ) }
                        checked={ thumbnailLink }
                        onChange={ () => setAttributes( { thumbnailLink: ! thumbnailLink } ) }
                    />
                ]
                : null
            }
        </PanelBody>
    );
}