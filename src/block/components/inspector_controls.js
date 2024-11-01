import StyleLayout from './inspector/style_layout';
import BorderSettings from './inspector/border_settings';
import ThumbnailSettings from './inspector/thumbnail_settings';
import ContentSettings from './inspector/content_settings';
import MetaSettings from './inspector/meta_settings';
import ColorSettings from './inspector/color_settings';
import FilterSettings from './inspector/filter_settings';
import SliderSettings from './inspector/slider_settings';

export default ( { props } ) => {
    const { InspectorControls } = wp.blockEditor;
    const { Fragment } = wp.element;
    const { 
        attributes: { postStyle }
    } = props;

    return(
        <InspectorControls>
            {
                ! props.posts.isRequesting && props.posts.data && props.posts.data.length > 0 
                ? [
                    <StyleLayout props={ props } />,
                    <ThumbnailSettings props={ props } />,
                    <ContentSettings props={ props } />,
                    <MetaSettings props={ props } />,
                    <ColorSettings props={ props } />,
                    <BorderSettings props={ props } />,
                    <Fragment>
                        { 
                            postStyle === 'card' 
                            ? <SliderSettings props={ props } /> 
                            : null 
                        }
                    </Fragment>
                ]
                : null
            }
            <FilterSettings props={ props } />
        </InspectorControls>
    );
}