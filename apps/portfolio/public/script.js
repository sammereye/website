$(document).ready(() => {
  $(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();
  
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - 10
    }, 500);
  });


  $('.navbar-bars').on('click', (e) => {
    $(e.target).parent().html('<i class="far fa-times"></i>');

    let navbarHeight = $(window).height() - $('header').outerHeight();
    
    $('.navbar-mobile').animate({top: `0`})
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
      } else {
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