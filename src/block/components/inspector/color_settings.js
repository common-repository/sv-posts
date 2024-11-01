// Required Components
const { __ } = wp.i18n;
const { 
    PanelColorSettings, 
    getColorObjectByColorValue,
    getColorClassName
} = wp.blockEditor;

export default ( { props } ) => {
    if ( ! props ) return '';

    const { 
        setAttributes,
        attributes: {
            postStyle,
            backgroundColor,
            titleColor,
            excerptColor,
            readMoreColor,
            infoColor,
            infoIconColor,
            categoryColor,
            categoryBackgroundColor,
            borderColor,
        }
    } = props;

    // Returns an color object if this color is defined in the editor
    function getColorObject( color ) {
        const settings = wp.data.select( 'core/editor' ).getEditorSettings();
        const colorObject = getColorObjectByColorValue( settings.colors, color );

        return colorObject;
    }

    // Returns the classname of the given color, if it's defined in the editor
    function getColorClass( color, type = 'color' ) {
        if ( ! color ) return '';
        if ( ! getColorObject( color ) ) return '';

        return getColorClassName( type, getColorObject( color ).slug );
    }
    
    // Color Settings
    let colorSettings = [
        {
            value: backgroundColor,
            onChange: ( value ) => { 
                setAttributes({ backgroundColor: value }),
                setAttributes({ backgroundColorClass: getColorClass( value, 'background-color' ) })
            },
            label: __( 'Background', 'sv_posts' ),
        },
        {
            value: borderColor,
            onChange: ( value ) => { 
                setAttributes({ borderColor: value })
            },
            label: __( 'Border', 'sv_posts' ),
        },
        {
            value: titleColor,
            onChange: ( value ) => { 
                setAttributes({ titleColor: value }),
                setAttributes({ titleColorClass: getColorClass( value ) })
            },
            label: __( 'Title', 'sv_posts' ),
        },
        {
            value: excerptColor,
            onChange: ( value ) => { 
                setAttributes({ excerptColor: value }),
                setAttributes({ excerptColorClass: getColorClass( value ) })
            },
            label: __( 'Excerpt', 'sv_posts' ),
        },
    ];

    if ( postStyle !== 'tile' ) {
        colorSettings.push( {
            value: readMoreColor,
            onChange: ( value ) => { 
                setAttributes({ readMoreColor: value }),
                setAttributes({ readMoreColorClass: getColorClass( value ) })
            },
            label: __( 'Read More', 'sv_posts' ),
        } );
    }

    if ( postStyle !== 'list' ) {
        colorSettings.push( {
            value: categoryColor,
            onChange: ( value ) => { 
                setAttributes({ categoryColor: value }),
                setAttributes({ categoryColorClass: getColorClass( value ) })
            },
            label: __( 'Category', 'sv_posts' ),
        } );

        colorSettings.push( {
            value: categoryBackgroundColor,
            onChange: ( value ) => { 
                setAttributes({ categoryBackgroundColor: value }),
                setAttributes({ categoryBackgroundColorClass: getColorClass( value, 'background-color' ) })
            },
            label: __( 'Category Background', 'sv_posts' ),
        } );
    }

    colorSettings.push( {
        value: infoColor,
        onChange: ( value ) => { 
            setAttributes({ infoColor: value }),
            setAttributes({ infoColorClass: getColorClass( value ) })
        },
        label: __( 'Meta', 'sv_posts' ),
    });

    colorSettings.push( {
        value: infoIconColor,
        onChange: ( value ) => { 
            setAttributes({ infoIconColor: value }),
            setAttributes({ infoIconColorClass: getColorClass( value ) })
        },
        label: __( 'Meta Icon', 'sv_posts' ),
    } );

    return(
        <PanelColorSettings
            title={ __( 'Colors', 'sv_posts' ) }
            initialOpen={ false }
            colorSettings={ colorSettings }
        >
        </PanelColorSettings>
    );
}