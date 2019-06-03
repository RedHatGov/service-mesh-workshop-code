$('#newBoardModal').on('show.bs.modal', function (event) {
    //var button = $(event.relatedTarget) // Button that triggered the modal
    //var recipient = button.data('whatever') // Extract info from data-* attributes

    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    
    // setup a validator
    $('#newboardSubmitButton').prop('disabled', true);
    $('.modal-body input').off('keyup');
    $('.modal-body input').on('keyup', validate);

    // clear out prior input values
    modal.find('.modal-body input').val('')
    modal.find('.modal-body textarea').val('')
    modal.find('.modal-body input:checkbox').prop("checked", false)
  })

function validate() {
  if ($('#newboardName').val()) {
    $('#newboardSubmitButton').prop('disabled', false);
  } else {
    $('#newboardSubmitButton').prop('disabled', true);
  }
}

// $('#newBoardForm').click(function(e){
//     e.preventDefault();
//     alert($('#newboardName').val());
//
//     $.post('http://path/to/post', 
//        $('#newBoardForm').serialize(), 
//        function(data, status, xhr){
//          // do something here with response;
//        });
//
// })