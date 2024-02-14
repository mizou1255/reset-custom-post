<?php
/*
Plugin Name: Reset Custom Post
Plugin URI: https://shop.bettoumi.fr
Description: The Reset custom post plugin deletes all data from a defined custom post, with the option of deleting images attached to the custom post type.
Version: 1.0
Author: Moez BETTOUMI
Author URI: https://moezbettoumi.fr
License: GPLv2 or later
Text Domain: reset-custom-post
*/
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

function enqueue_custom_scripts() {
    wp_enqueue_style('reset-custom-post-css', plugins_url('assets/css/styles.css', __FILE__));
    wp_enqueue_script('reset-custom-post-js', plugins_url('assets/js/scripts.js', __FILE__), array('jquery'), null, true);
}
add_action('admin_enqueue_scripts', 'enqueue_custom_scripts');

require_once(plugin_dir_path(__FILE__) . 'inc/admin-page.php');
require_once(plugin_dir_path(__FILE__) . 'inc/cleanup-functions.php');


