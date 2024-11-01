import './editor.scss';
import icon from './icons/block';
import edit from './edit';
import attributes from './attributes';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

registerBlockType( 'straightvisions/sv-posts', {
	title: __( 'SV Posts' ),
	description: __( 'Display your most recent posts, in the way you want it.', 'sv_posts' ),
	icon,
	category: 'straightvisions',
	keywords: [
		__( 'SV Posts', 'sv_posts' ),
		__( 'Blog', 'sv_posts' ),
		__( 'Posts', 'sv_posts' ),
	],
	supports: {
		align: [ 'wide', 'full' ],
	},
	attributes,
	edit,
	save: () => {
		return null;
	}
} );