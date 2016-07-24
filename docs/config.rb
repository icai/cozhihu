require 'compass'
require 'compass/exec'
require 'sass-globbing'

# Require any additional compass plugins here.
project_type = :stand_alone

# Publishing paths
http_path = "/"
http_images_path = "/vendor/images"
http_generated_images_path = "/vendor/images"
http_fonts_path = "/vendor/fonts"
css_dir = "_site/css"

# Local development paths
sass_dir = "css"
images_dir = "vendor/images"
fonts_dir = "vendor/fonts"

# sourcemap = true
line_comments = false
output_style = :compressed
