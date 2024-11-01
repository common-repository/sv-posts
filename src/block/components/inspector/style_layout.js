export default ( { props } ) => {
    if ( ! props ) return '';

    const { __ } = wp.i18n;
    const { 
        PanelBody, 
        SelectControl,
        RangeControl,
    } = wp.components;
    const { 
        setAttributes,
        attributes: { 
            postStyle,
            layout,
            columns,
            slickSlider,
        }
    } = props;

    return(
        <PanelBody 
            title={ __( 'Style & Layout', 'sv_posts' ) }
            initialOpen={ false }
        >
            {
                typeof gutenbergPlugin !== 'undefined' 
                ? null
                : <SelectControl 
                    label={ __( 'Post Style', 'sv_posts' ) }
                    value={ postStyle }
                    options={ [
                        { label: __( 'Card', 'sv_posts' ), value: 'card' },
                        { label: __( 'List', 'sv_posts' ), value: 'list' },
                        { label: __( 'Tile', 'sv_posts' ), value: 'tile' },
                    ] }
                    onChange={ ( value ) => setAttributes( { postStyle: value } ) }
                />
            }
            {
                postStyle === 'card' 
                ? <SelectControl 
                    label={ __( 'Layout', 'sv_posts' ) }
                    value={ layout }
                    options={ [
                        { label: __( 'Grid', 'sv_posts' ), value: 'grid' },
                        { label: __( 'Masonry', 'sv_posts' ), value: 'masonry', disabled: slickSlider },
                    ] }
                    onChange={ ( value ) => setAttributes( { layout: value } ) }
                />
                : null
            }
            {
                postStyle !== 'list'
                ? <RangeControl
                    label={ __( 'Columns', 'sv_posts' ) }
                    value={ columns }
                    onChange={ ( value ) => setAttributes( { columns: value } ) }
                    min={ 1 }
                    max={ 6 }
                />
                : null
            }
        </PanelBody>
    );
}