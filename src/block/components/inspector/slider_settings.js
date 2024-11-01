const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { 
    PanelBody, 
    ToggleControl,
    RangeControl,
} = wp.components;

export default ( { props } ) => {
    if ( ! props ) return '';

    // Block Attributes
    const { 
        setAttributes,
        attributes: {
            slickSlider,
            slickSliderAutoplay,
            slickSliderAutoplaySpeed,
            slickSliderInfinite,
            slickSliderArrows,
            slickSliderDots,
            slickSliderCenterMode,
            slickSliderSlidesToScroll,
            slickSliderSpeed,
            columns
        }
    } = props;

    return(
        <PanelBody 
            title={ __( 'Slider', 'sv_posts' ) }
            initialOpen={ false }
        >
            <ToggleControl
                label={ __( 'Activate Slider', 'sv_posts' ) }
                checked={ slickSlider }
                onChange={ () => {
                    setAttributes( { slickSlider: ! slickSlider } );

                    if ( ! slickSlider ) {
                        setAttributes( { layout: 'grid' } );
                    }
                } }
            />
            {
                slickSlider ? [
                    <ToggleControl
                        label={ __( 'Autoplay', 'sv_posts' ) }
                        checked={ slickSliderAutoplay }
                        onChange={ () => setAttributes( { slickSliderAutoplay: ! slickSliderAutoplay } )}
                    />,
                    <Fragment>
                        {
                            slickSliderAutoplay ? [
                                <RangeControl
                                    label={ __( 'Autoplay Speed (ms)', 'sv_posts' ) }
                                    value={ slickSliderAutoplaySpeed }
                                    onChange={ value => setAttributes( { slickSliderAutoplaySpeed: value } ) }
                                    min={ 2000 }
                                    max={ 10000 }
                                    step='500'
                                />
                            ]
                            : null
                                
                        }
                    </Fragment>,
                    <ToggleControl
                        label={ __( 'Infinite', 'sv_posts' ) }
                        checked={ slickSliderInfinite }
                        onChange={ () => setAttributes( { slickSliderInfinite: ! slickSliderInfinite } )}
                    />,
                    <ToggleControl
                        label={ __( 'Show Arrows', 'sv_posts' ) }
                        checked={ slickSliderArrows }
                        onChange={ () => setAttributes( { slickSliderArrows: ! slickSliderArrows } )}
                    />,
                    <ToggleControl
                        label={ __( 'Show Dots', 'sv_posts' ) }
                        checked={ slickSliderDots }
                        onChange={ () => setAttributes( { slickSliderDots: ! slickSliderDots } )}
                    />,
                    <ToggleControl
                        label={ __( 'Center Mode', 'sv_posts' ) }
                        checked={ slickSliderCenterMode }
                        onChange={ () => setAttributes( { slickSliderCenterMode: ! slickSliderCenterMode } ) }
                    />,
                    <RangeControl
                        label={ __( 'Slides to show', 'sv_posts' ) }
                        value={ columns }
                        onChange={ value => setAttributes( { columns: value } ) }
                        min={ 1 }
                        max={ 6 }
                    />,
                    <Fragment>
                        {
                            ! slickSliderCenterMode ?
                                <RangeControl
                                    label={ __( 'Slides to scroll', 'sv_posts' ) }
                                    value={ slickSliderSlidesToScroll }
                                    onChange={ value => setAttributes( { slickSliderSlidesToScroll: value } ) }
                                    min={ 1 }
                                    max={ 6 }
                                />
                            :null
                        }
                    </Fragment>,
                    <RangeControl
                        label={ __( 'Speed (ms)', 'sv_posts' ) }
                        value={ slickSliderSpeed }
                        onChange={ value => setAttributes( { slickSliderSpeed: value } ) }
                        min={ 100 }
                        max={ 2000 }
                        step='50'
                    />
                ]
                : null
            }
        </PanelBody>
    );
}