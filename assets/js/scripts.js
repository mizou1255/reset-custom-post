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
                    $('#log').append('<p>'+response.data.log+'</p>');
                    $('#log').scrollTop($('#log')[0].scrollHeight);
                    var postId = response.data.post_id;
                    if (response.data.imagesIds !== undefined && response.data.imagesIds.length > 0) {
                            mlz_reset_cptImages(postId, response.data.imagesIds, 0);
                    } 
                    if (offset < totalPosts) {
                        $('#progress-bar').css('width', response.data.progress + '%');
                        performmlz_reset_cpt(offset+1);
                    } else {
                        $('#progress-bar').css('width', '100%');
                        loaderHide();
                    } 
                },
                error: function(xhr, status, error) {
                    console.error(error);
                    loaderHide();
                }  
            });
        }

        performmlz_reset_cpt(0);
        
        deleteElementsTaxonomies();
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
                $('#log').append('<p>'+response.data.log+'</p>');
                $('#log').scrollTop($('#log')[0].scrollHeight);
                mlz_reset_cptImages(postId, imageIds, currentIndex + 1);
            },
            error: function(xhr, status, error) {
                console.error(error);
                loaderHide();
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
        var taxonomyList = document.getElementById('taxonomy-list');
        $('#taxonomy-list').empty();
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
                var taxonomies = response.data.taxonomies;

                $('#log').append('<p>'+response.data.log+'</p>');
                $('#log').scrollTop($('#log')[0].scrollHeight);
                $('#total-posts').text(response.data.msg);
                $('#mlz_reset_cpt_button').attr('data-total', response.data.total);
                if (response.data.total == 0 && taxonomies == '') {
                    $('#mlz_reset_cpt_button').attr('disabled', true);
                } else {
                    $('#mlz_reset_cpt_button').attr('disabled', false);
                }

                if (taxonomies) {
                    $.each(taxonomies, function(index, taxonomy) {
                        var wrapperDiv = $('<div class="taxonomy_item">');
                
                        var containerDiv = $('<label>').addClass('toggle-switch');
                        var checkbox = $('<input>').attr({type: 'checkbox', name: taxonomy.name, value: taxonomy.name, id: taxonomy.name, checked: true});
                        var backgroundDiv = $('<div>').addClass('toggle-switch-background');
                        var handleDiv = $('<div>').addClass('toggle-switch-handle');
                
                        containerDiv.append(checkbox);
                        containerDiv.append(backgroundDiv);
                        backgroundDiv.append(handleDiv);
                
                        var label = $('<strong>').text(taxonomy.name + ' (' + taxonomy.count + ')');
                
                        wrapperDiv.append(label);
                        wrapperDiv.append(containerDiv);
                
                        $('#taxonomy-list').append(wrapperDiv);
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error(error);
                loaderHide();
            }                
        });
    });

    function deleteElementsTaxonomies() {
        var nonce = $('#nonce').val();
        var taxonomiesChecked = $('.taxonomy_item input[type="checkbox"]:checked');
        taxonomiesChecked.each(function(index, element) {
            var taxonomyName = $(element).val();
            var data = {
                action: 'delete_elements_taxonomy',
                taxonomy_name: taxonomyName,
                nonce: nonce
            };
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: data,
                dataType: 'json',
                success: function(response) {
                    if(response.success) {
                        $('#log').append('<p>'+response.data.log+'</p>');
                        $('#log').scrollTop($('#log')[0].scrollHeight);
                    } else {
                        console.error(response.data);
                    }
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        });
    }
});