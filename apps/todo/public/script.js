$(document).ready(() => {
  $('.newTodo').on('click', () => {
    $.post('/todo/newTodo', {title: $('.newTodoInput').val()}, (res, status) => {
      console.log(status);
      if (status == 'success') {
        $('.todo-list').children().last().before(
          $('<li/>', {text: $('.newTodoInput').val()})
        )
      }
    });
  });
});