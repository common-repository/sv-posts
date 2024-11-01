=== SV Posts ===
Contributors: matthias-reuter, matthiasbathke, dennisheiden
Donate link: https://straightvisions.com
Tags: latest posts, post gallery, grid, masonry, list
Requires PHP: 8.0
Requires at least: 6.0
Tested up to: 6.2.2
Stable tag: 2.0.00
License: GPL-3.0-or-later
License URI: https://www.gnu.org/licenses/gpl-3.0-standalone.html

SV Posts is an advanced block to show Posts with custom order, filters and styles.

== Description ==

Do you want to present posts and pages according to your wishes?

Then our Gutenberg-Block SV Posts is just right for you!

Our SV Posts Block for the Gutenberg Editor offers you full control and creative freedom in the presentation of your content!

✔ Different Styles: List, Tile, Card (Grid & Masonry view)
✔ Show/hide titles 
✔ Show/hide the post image
✔ Adjust post image size
✔ Show/hide content
✔ Adjust content length
✔ Show/hide “Read more” text
✔ Customize “Read more” text
✔ Show/hide author
✔ Show/hide date
✔ Show/hide categories
✔ Show/hide “Edit” link
✔ Adjust colors
✔ Different Styles
✔ Adjust the number of columns
✔ Sort by date
✔ Sort by title
✔ Sort by author
✔ Sort by Updated
✔ Adjusting order
✔ Filterby Author
✔ Filter by Post Type
✔ Filter by Post ID’s
✔ Filter by post image
✔ Filter by category
✔ Filter by date
✔ Filter by status
✔ Remove current mail from the list

<a href="https://straightvisions.com/en/sv-posts/">More information and preview</a>

= Requires: =
* PHP 7.3 or higher
* WordPress 5.5.1 or higher

= Plugin Description =

SV Posts is an advanced block to show Posts with custom order, filters and styles.

= Team =

* Developed and maintenanced by <a href="https://straightvisions.com">straightvisions GmbH</a>

== Installation ==

This plugin is build to work out-of-the-box. Installation is quite simple.

1. Upload plugin-directory to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. You are using a caching plugin? Don't forget to flush caches now.
4. Use the SV Posts Block within Block-Editor when editing pages or posts.

== Screenshots ==

1. Step 1: select SV Posts Block
2. Step 2: select style
3. Step 3: configure to your needs

== Changelog ==

= 2.0.00 =
### Various

* Core Update

= 1.9.00 =
### Various

* Core Update

= 1.8.04 =
### Various

* Core Update

= 1.8.03 =
### Security Fix

* Third Party Vendor Library

### Various

* Core Update

= 1.8.02 =
### Various

* Core Update

= 1.8.01 =
### Various

* Core Update

= 1.7.00 =

### Various

* Core update

= 1.6.00 =

### Various

* Core update

= 1.5.15 =

### Various

* Core update

= 1.5.14 =

### Various

* Core update

= 1.5.13 =

### Various

* Core update

= 1.5.12 =

### Bug Fixes

* Fixed a bug where when WPML was active and a post had no language set, it would not output the post.

= 1.5.11 =

### Improvements

* Updated API Request to improve performance
* Added loading animation when infinite scroll is loading new posts

### Bug Fixes

* Fixed missing categories in editor view
* Fixed inline styles output

### Various

* Updated deprecated methods
* Editor: When post type is other than "post" and "page" and orderby is "Random", orderby will be set to "Date" in the editor, due to a problem with the WP Rest API.

= 1.5.10 =

### Improvements

* Added indicator for the selected post style, in the block controls

### Bug Fixes

* Fixed missing attribute checks, that triggered PHP notices
* Fixed that taxnomy filter wasn't working correctly in the editor
* Fixed excerpt class and style output
* Fixed missing Styles & Layout inspector panel

### Various

* Core update

= 1.5.00 =

### Various

* Core update

= 1.4.40 =

### Features

* Added translation for "German"

= 1.4.39 =

### Features

* Added "Category Border Radius" to inspector panel "Border", when PostStyle "Card" or "Tile" is selected.

### Improvements

* Changed the default settings, for a better out of the box experience.

= 1.4.38 =

### Bug Fixes

* Fixed a bug where the taxonomy filter wont work in the editor, when a custom post type is selected

= 1.4.37 =

### Improvements

* Minor style improvements

= 1.4.36 =

### Features

* Added "Autoplay" to inspector panel "Slider"
* Added "Autoplay Speed" to inspector panel "Slider"
* Added "Infinite" to inspector panel "Slider"
* Added "Show Dots" to inspector panel "Slider"
* Added "Center Mode" to inspector panel "Slider"
* Added "Slides to show" to inspector panel "Slider"
* Added "Slides to scroll" to inspector panel "Slider"
* Added "Speed" to inspector panel "Slider"

### Improvements

* Inspector settings only load when available
* Improved CSS styles for slider

### Bug Fixes

* Fixed a bug where the block breaks when it is clicked while posts are still loading
* Fixed a bug that a extra <p> tag will be outputted when content is "Full Post"

= 1.4.35 =

### Features

* Added inspector panel "Slider", to add slider settings

= 1.4.34 =

### Features

* Added inspector panel "Border", to add border settings
* Added "Thumbnail Position" setting to "Thumbnail" panel

### Improvements

* Added <picture> tag selector support to style rules with <img> tag

### Various

* Changed default layout from Masonry to Grid
* Renamed inspector panel "Post Thumbnail" into "Thumbnail"
* Renamed inspector panel "Post Content" into "Title & Content"
* Renamed inspector panel "Meta Settings" into "Meta"
* Renamed inspector panel "Color Settings" into "Colors"
* Renamed inspector panel "Sorting and Filtering" into "Sorting & Filtering"
* Moved thumbnail settings into "Thumbnail" panel
* Moved title settings into "Title & Content" panel

= 1.4.32 =

= 1.4.33 =
### Various

* Core update

= 1.4.32 =

### Features

* Toggle if the post thumbnail should link to the post or not

= 1.4.31 =

### Features

* Added Order by Random option for Order by Filter
* Toggle if the post title should link to the post or not

= 1.4.30 =

### Features

* Font Size for Post Title, Excerpt, Read More & Meta

= 1.4.29 =

### Features

* Font Size for Post Title, Excerpt, Read More & Meta

### Various

* Changed the Filter by Categories to Filter by Taxonomy terms
* Filter By Taxonomy Terms allows to filter by custom taxonomies and their terms
* Enabled all post types for Filter by Post Type
* Custom Taxonomy terms won't update in the editor if selected
* Added fallback for thumbnails, if no media sizes are available in the editor
* Added fallback for excerpt, if excerpt not available

= 1.4.28 =
### Features

* Added new Order By Option
* Added new filter option to replace post permalinks with the permalink of the category page

### Various

* Refactored class-names

= 1.4.27 =
### Features

* Added Pagination Support
* Added Block-Rendering when excerpt is set to full content

### Bug Fixes

* Fixed Infinte Scroll distance check

### Various

* Pagination toggles Infinite Scroll off when activated and vice versa
* Classes are added to the wrapper, depending on the settings Pagination (.is-paginated) & Infinte Scroll (.is-infinite-scroll)
* Core update

= 1.4.26 =
### Features

* Add Infinite Scroll Feature, to load more posts on scroll via Ajax

= 1.4.25 =
### Various

* Core update

= 1.4.24 =
### Various

* Core update

= 1.4.23 =
### Bug Fixes

* Remove category list limit in block edit view
* filter by post ID not working in frontend
* filter by category not working in frontend

= 1.4.22 =
### Features

* Added support for Custom Post Types

### Bug Fixes

* Fix category duplicates when category is translated with WPML

### Various

* Core update

= 1.4.21 =
### Bug Fixes

* Fix JS error in Gutenberg Editor when category link of post is not available

### Various

* Core update

= 1.4.20 =
### Various

* Initial release

== Upgrade Notice ==
Core Update

== Missing a feature? ==

Please use the plugin support forum here on WordPress.org. We will add your wish - if achievable - on our todo list. Please note that we can not give any time estimate for that list or any feature request.

= Paid Services =
Nevertheless, feel free to hire our <a href="https://straightvisions.com">full stack Webdeveloper</a> team if you have any of the following needs:

* Get a customization
* Get a feature rapidly / on time
* Get a custom WordPress plugin or theme developed to exactly fit your needs.