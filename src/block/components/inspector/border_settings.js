// Required Components
const { __ } = wp.i18n;
const { 
    RangeControl,
    PanelBody 
} = wp.components;

export default ( { props } ) => {
    if ( ! props ) return '';

    // Block Attributes
    const { 
        setAttributes,
        attributes: {
            postStyle,
            showThumbnail,
            borderWidthTop,
            borderWidthRight,
            borderWidthBottom,
            borderWidthLeft,
            borderRadius,
            borderRadiusCategory,
        }
    } = props;

    // Functions to set the block attributes
    const setBorderWidthTop         = borderWidthTop        => setAttributes({ borderWidthTop });
    const setBorderWidthRight       = borderWidthRight      => setAttributes({ borderWidthRight });
    const setBorderWidthBottom      = borderWidthBottom     => setAttributes({ borderWidthBottom });
    const setBorderWidthLeft        = borderWidthLeft       => setAttributes({ borderWidthLeft });
    const setBorderRadius           = borderRadius          => setAttributes({ borderRadius });
    const setBorderRadiusCategory   = borderRadiusCategory  => setAttributes({ borderRadiusCategory });

    // Border Width All
    let borderWidth = 0;

    if ( 
        borderWidthTop === borderWidthRight 
        && borderWidthRight === borderWidthBottom 
        && borderWidthBottom === borderWidthLeft
    ) {
        borderWidth = Number.isInteger( borderWidthTop ) && borderWidthTop > -1 ? borderWidthTop : 0;
    }

    return(
        <PanelBody
            title={ __( 'Border', 'sv_posts' ) }
            initialOpen={ false }
        >
            <RangeControl
                label={ __( 'Border Width', 'sv_posts' ) }
                value={ borderWidth }
                onChange={ value => {
                    setBorderWidthTop( value );
                    setBorderWidthRight( value );
                    setBorderWidthBottom( value );
                    setBorderWidthLeft( value );
                }}
                allowReset
                min={ 0 }
                max={ 10 }
            />
            <RangeControl
                label={ __( 'Border Radius', 'sv_posts' ) }
                value={ borderRadius }
                onChange={ value => {
                    value = ! value ? 0 : value;
                    setBorderRadius( value );
                }}
                allowReset
                min={ 0 }
                max={ 50 }
            />
            {
                ( postStyle === 'card' && showThumbnail ) || ( postStyle === 'tile' ) ?
                    <RangeControl
                        label={ __( 'Category Border Radius', 'sv_posts' ) }
                        value={ borderRadiusCategory }
                        onChange={ value => {
                            value = ! value ? 0 : value;
                            setBorderRadiusCategory( value );
                        }}
                        allowReset
                        min={ 0 }
                        max={ 50 }
                    />
                : null
            }
        </PanelBody>
    );
}