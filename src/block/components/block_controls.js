// Required Components
import brush from '../icons/brush';
import list from '../icons/list';
import card from '../icons/card';
import tile from '../icons/tile';

const { __ } = wp.i18n;
const { BlockControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { 
    ToolbarGroup, 
    DropdownMenu,
    MenuGroup,
    MenuItem,
 } = wp.components;

export default ( { props } ) => {
     const { 
        setAttributes,
        attributes: { postStyle }
    } = props;

    const PostStyle = () => (
        <DropdownMenu
            icon={ brush }
            hasArrowIndicator={ true }
            label={ __( 'Change post style', 'sv_posts' ) }
        >
            { () => (
                <Fragment>
                    <MenuGroup>
                        <MenuItem
                            icon={ card }
                            isSelected={ true }
                            className={ [ 'sv-post-style-button', postStyle === 'card' ? 'is-selected' : '' ] }
                            onClick={ () => {
                                setAttributes( { postStyle: 'card' } )
                            } }
                        >
                        { __( 'Card', 'sv_posts' ) }
                        </MenuItem>
                        <MenuItem
                            icon={ list }
                            isSelected={ postStyle === 'list' ? true : false }
                            className={ [ 'sv-post-style-button', postStyle === 'list' ? 'is-selected' : '' ] }
                            onClick={ () => {
                                setAttributes( { postStyle: 'list' } )
                            } }
                        >
                        { __( 'List', 'sv_posts' ) }
                        </MenuItem>
                        <MenuItem
                            icon={ tile }
                            isSelected={ postStyle === 'tile' ? true : false }
                            className={ [ 'sv-post-style-button', postStyle === 'tile' ? 'is-selected' : '' ] }
                            onClick={ () => {
                                setAttributes( { postStyle: 'tile' } )
                            } }
                        >
                        { __( 'Tile', 'sv_posts' ) }
                        </MenuItem>
                    </MenuGroup>
                </Fragment>
            ) }
        </DropdownMenu>
    );

    return(
        <BlockControls>
            <ToolbarGroup label={ __( 'Post Style', 'sv_posts' ) } >
                <PostStyle />
            </ToolbarGroup>
        </BlockControls>
    );
}