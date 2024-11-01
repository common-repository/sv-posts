const { __ } = wp.i18n;
const { 
    PanelBody, 
    ToggleControl,
    FontSizePicker
} = wp.components;
const { fontSizes } = wp.data.select('core/block-editor').getSettings();

export default ( { props } ) => {
    if ( ! props ) return '';

    // Block Attributes
    const { 
        setAttributes,
        attributes: {
            postStyle,
            showAuthor,
            showDate,
            showCategories,
            metaLinkCategories,
            showEdit,
            filterByType,
            metaFontSize
        }
    } = props;

    // Functions to set the block attributes
    const setMetaFontSize = metaFontSize => setAttributes({ metaFontSize });

    return(
        <PanelBody 
            title={ __( 'Meta', 'sv_posts' ) }
            initialOpen={ false }
        >
            <ToggleControl
                label={ __( 'Author', 'sv_posts' ) }
                checked={ showAuthor }
                onChange={ () => setAttributes( { showAuthor: ! showAuthor } ) }
            />
            <ToggleControl
                label={ __( 'Date', 'sv_posts' ) }
                checked={ showDate }
                onChange={ () => setAttributes( { showDate: ! showDate } ) }
            />
            <ToggleControl
                label={ __( 'Categories', 'sv_posts' ) }
                checked={ showCategories }
                onChange={ () => setAttributes( { showCategories: ! showCategories } ) }
            />
            <ToggleControl
                label={ __( 'Link Categories', 'sv_posts' ) }
                checked={ metaLinkCategories }
                onChange={ () => setAttributes( { metaLinkCategories: ! metaLinkCategories } ) }
            />
            {
                postStyle !== 'tile' ?
                <ToggleControl
                    label={ __( 'Edit', 'sv_posts' ) }
                    checked={ showEdit }
                    onChange={ () => setAttributes( { showEdit: ! showEdit } ) }
                />
                : null
            }
            {
                showAuthor || showDate || showCategories || showEdit ?
                <FontSizePicker
                    fontSizes={ fontSizes }
                    value={ metaFontSize }
                    onChange={ newFontSize => setMetaFontSize( newFontSize ) }
                />
                : null
            }
        </PanelBody>
    );
}