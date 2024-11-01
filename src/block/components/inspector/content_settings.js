const { __ } = wp.i18n;
const { 
    PanelBody, 
    TextControl,
    ToggleControl,
    SelectControl,
    RangeControl,
    RadioControl,
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
            contentAlign,
            showTitle,
            titleFontSize,
            titleLink,
            showExcerpt,
            excerptType,
            excerptLength,
            excerptFontSize,
            excerptAlign,
            showReadMore,
            readMoreText,
            readMoreFontSize,
            readMoreAlign,
        }
    } = props;
    
    // Functions to set the block attributes
    const setTitleFontSize      = titleFontSize     => setAttributes({ titleFontSize });
    const setExcerptFontSize    = excerptFontSize   => setAttributes({ excerptFontSize });
    const setReadMoreFontSize   = readMoreFontSize  => setAttributes({ readMoreFontSize });

    return(
        <PanelBody 
            title={ __( 'Title & Content', 'sv_posts' ) }
            initialOpen={ false }
        >
            <SelectControl
                label={ __( 'Alignment', 'sv_posts' ) }
                value={ contentAlign }
                options={ [
                    { label: __( 'Left', 'sv_posts' ), value: 'left', default: true },
                    { label: __( 'Center', 'sv_posts' ), value: 'center' },
                    { label: __( 'Right', 'sv_posts' ), value: 'right' },
                ] }
                onChange={ ( value ) => setAttributes( { contentAlign: value } ) }
            />
            <hr />
            <ToggleControl
                label={ __( 'Title', 'sv_posts' ) }
                checked={ showTitle }
                onChange={ () => setAttributes( { showTitle: ! showTitle } ) }
            />
            {
                showTitle ? [
                    <ToggleControl
                        label={ __( 'Link title to post', 'sv_posts' ) }
                        checked={ titleLink }
                        onChange={ () => setAttributes( { titleLink: ! titleLink } ) }
                    />,
                    <FontSizePicker
                        fontSizes={ fontSizes }
                        value={ titleFontSize }
                        onChange={ newFontSize => setTitleFontSize( newFontSize ) }
                    />
                ]
                : null
            }
            <hr />
            <ToggleControl
                label={ __( 'Content', 'sv_posts' ) }
                checked={ showExcerpt }
                onChange={ () => setAttributes( { showExcerpt: ! showExcerpt } ) }
            />
            {
                showExcerpt ?
                <RadioControl
                    label={ __( 'Show', 'sv_posts' ) }
                    selected={ excerptType }
                    options={ [
                        { label: __( 'Excerpt', 'sv_posts' ), value: 'excerpt' },
                        { label: __( 'Full Post', 'sv_posts' ), value: 'full_post' },
                    ] }
                    onChange={ ( value ) => setAttributes( { excerptType: value } ) }
                /> :
                null
            }
            {
                showExcerpt && excerptType === 'excerpt' ?
                    <RangeControl
                        label={ __( 'Max number of words in excerpt', 'sv_posts' ) }
                        value={ excerptLength }
                        onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
                        min={ 1 }
                        max={ 1000 }
                    />
                : null
            },
            {
                showExcerpt ?
                <FontSizePicker
                    fontSizes={ fontSizes }
                    value={ excerptFontSize }
                    onChange={ newFontSize => setExcerptFontSize( newFontSize ) }
                />
                : null
            }
            {
                1==1 ? [
                    <ToggleControl
                        label={ __( 'Show Read More', 'sv_posts' ) }
                        checked={ showReadMore }
                        onChange={ () => setAttributes( { showReadMore: ! showReadMore } ) }
                    />,
                    showReadMore ? [
                        <TextControl
                            label={ __( 'Read More Text', 'sv_posts' ) }
                            value={ readMoreText }
                            onChange={ ( value ) => setAttributes( { readMoreText: value } ) }
                        />,
                        <FontSizePicker
                            fontSizes={ fontSizes }
                            value={ readMoreFontSize }
                            onChange={ newFontSize => setReadMoreFontSize( newFontSize ) }
                        />
                    ]
                    : null
                ]
                : null
            }
        </PanelBody>
    );
}