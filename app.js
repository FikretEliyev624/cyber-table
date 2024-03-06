$(document).ready(function(){
    // Trigger AJAX request when document is ready
    $.ajax({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      success: function(postsData) {
        $('#postsTable tbody').empty();
        
        var limitedPosts = postsData.slice(0, 3);
        
        $.each(limitedPosts, function(index, post) {
          // Truncate post.body to a maximum of 30 characters
          var truncatedBody = post.body.length > 30 ? post.body.substring(0, 30) + '...' : post.body;
          
          var newRow = '<tr>' +
                        '<th>' + post.id + '</th>' +
                        '<td>' + post.title + '</td>' +
                        '<td>' + truncatedBody + '</td>' +
                        '<td id="comments_' + post.id + '"><span class="loading loading-dots loading-md"></span></td>' +
                      '</tr>';
          $('#postsTable tbody').append(newRow);
          
         
          setTimeout(function() {
            $.ajax({
              url: 'https://jsonplaceholder.typicode.com/comments?postId=' + post.id,
              method: 'GET',
              success: function(commentsData) {
                var comments = '';
                var commentCount = 0;
                $.each(commentsData, function(index, comment) {
                  if (commentCount < 3) { 
                    var lines = comment.body.split(/\r?\n/);
                    var commentWithBr = '';
                    for (var i = 0; i < lines.length; i++) {
                      commentWithBr += lines[i];
                      if ((i + 1) % 4 === 0) {
                        commentWithBr += '<br><br>';
                      }
                    }
                    comments += '<p>' + commentWithBr + '</p>';
                    commentCount++;
                  }
                });
                $('#comments_' + post.id).html(comments);
              },
              error: function(xhr, status, error) {
                console.error(xhr, status, error);
              }
            });
          }, 3000); // 3-second delay
        });
      },
      error: function(xhr, status, error) {
        console.error(xhr, status, error);
      }
    });
  });
