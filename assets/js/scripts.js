jQuery(document).ready(function($) {
    $('#mlz_reset_cpt_button').on('click', function(e) {
        e.preventDefault();
        loaderShow();
        var customPostType = $('#custom_post_type').val();
        var totalPosts = $(this).data('total');
        var deleteImages = $('#delete_images').prop('checked') ? 1 : 0;
        var nonce = $('#nonce').val();

        function performmlz_reset_cpt(offset) {
            var data = {
                'action': 'mlz_reset_cpt',
                'custom_post_type': customPostType,
                'totalPosts': totalPosts,
                'delete_images': deleteImages,
                'offset': offset,
                'nonce': nonce
            };

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: data,
                dataType: 'json',
                success: function(response) {
                    $('#log').append('<p>'+response.log+'</p>');
                    $('#log').scrollTop($('#log')[0].scrollHeight);
                    var postId = response.post_id;
                    console.log(response);
                    if (response.imagesIds !== undefined && response.imagesIds.length > 0) {
                            mlz_reset_cptImages(postId, response.imagesIds, 0);
                    } 
                        
                    if (offset < totalPosts) {
                        $('#progress-bar').css('width', response.progress + '%');
                        performmlz_reset_cpt(offset+1);
                    } else {
                        $('#progress-bar').css('width', '100%');
                        loaderHide();
                    } 
                },
                error: function(response) {
                    loaderHide();
                }
            });
        }

        performmlz_reset_cpt(0);
    });

    function mlz_reset_cptImages(postId, imageIds, currentIndex) {
        if (currentIndex >= imageIds.length) {
            return;
        }

        var imageId = imageIds[currentIndex];
        var nonce = $('#nonce').val();
        var data = {
            'action': 'mlz_reset_cpt_image',
            'image_id': imageId,
            'post_id': postId,
            'nonce': nonce
        };

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function(response) {
                $('#log').append('<p>'+response.log+'</p>');
                $('#log').scrollTop($('#log')[0].scrollHeight);
                mlz_reset_cptImages(postId, imageIds, currentIndex + 1);
            }
        });
    }

    function loaderShow() {
        $('.rcpt-load').addClass('show');
        $('.panel-form').addClass('loading');
    }
    function loaderHide() {
        $('.rcpt-load').removeClass('show');
        $('.panel-form').removeClass('loading');
    }
    $('#custom_post_type').on('change', function() {
        var customPostType = $(this).val();
        var nonce = $('#nonce').val();
        loaderShow();
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'get_total_posts',
                custom_post_type: customPostType,
                'nonce': nonce
            },
            success: function(response) {
                loaderHide();
                $('#log').append('<p>'+response.log+'</p>');
                $('#log').scrollTop($('#log')[0].scrollHeight);
                $('#total-posts').text(response.total);
                $('#mlz_reset_cpt_button').attr('data-total', response.total);
                $('#mlz_reset_cpt_button .btn-txt').text(response.msg);
                if (response.total > 0) {
                    $('#mlz_reset_cpt_button').attr('disabled', false);
                } else {
                    $('#mlz_reset_cpt_button').attr('disabled', true);
                }
            },
            error: function(response) {
                loaderHide();
            }
        });
    });
});