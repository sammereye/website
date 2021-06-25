$(document).ready(() => {
  $(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();
  
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - 10
    }, 500);
  });


  $('.navbar-bars').on('click', (e) => {
    if ($(e.currentTarget).children().first().hasClass('fa-bars')) {
      $(e.currentTarget).html('<i class="far fa-times"></i>');

      
      $('.navbar-mobile').animate({
        top: "0"
      }, {
        duration: 250,
        complete: function() {
          $(e.currentTarget).css('color', '#fafafa')
        }
      });
    } else {
      $(e.currentTarget).html('<i class="far fa-bars"></i>');

      $(e.currentTarget).css('color', '#0F1917')
      $('.navbar-mobile').animate({
        top: `${$(window).height() + 50}px`
      }, {
        duration: 250,
        complete: function() {
          
        }
      });
    }



    
  })

  

  $('#contactForm').on('submit', (e) => {
    e.preventDefault();

    let nameField = $(e.target).find('#name');
    let emailField = $(e.target).find('#email');
    let messageField = $(e.target).find('#message');

    let data = {
      name:    nameField.val(),
      email:   emailField.val(),
      message: messageField.val()
    }
  
    $.post('/submitContactForm', data, (res, status) => {
      if (status == 'success') {
        $('.alert').text('Message sucessfully sent')
        $('.alert').animate({
          top: "35px"
        }, {
          duration: 750,
          complete: function() {
            setTimeout(function() {
              $('.alert').animate({top: '-100px'})
            }, 2000)
          }
        });

        nameField.val('');
        emailField.val('');
        messageField.val('');
      }
    }).fail((xhr, status, error) => {
      if (status == 'error') {
        $('.alert').text('Message failed to send')
        $('.alert').animate({
          top: "35px"
        }, {
          duration: 750,
          complete: function() {
            setTimeout(function() {
              $('.alert').animate({top: '-100px'})
            }, 2000)
          }
        });
      }
    });
  })
})