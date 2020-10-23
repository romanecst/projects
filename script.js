function count(){
    $('#tot').text($('.msg').length);
}

function bin(el){
    $(el).click(
        function(){
            $(this).parent().remove();
            count();
        });
}
bin('.poubelle');
$('#add').click(
    function(){
        var value = $('#barre').val();
        $('body').append(`
        <div class='flexbox'>
            <img src='My Mails-Assets/avatar-6.png' class='avatar'>
            <div class='msg'>
                <h5  class='nom'>Romane Castera</h5>
                <p>${value}</p>
            </div>
            <img src='My Mails-Assets/trash.png' class='poubelle trash'></img>
        </div>
        `);
    $('#barre').val('') ;
    count();
    bin('.trash');
    });

$('#add2').click(
    function(){
        $('.flexbox').hide();
        var c = 0;
        $('h5').each(function(){
            var bar = $('#barre2').val().toLowerCase();
            var msg = $(this).text().toLowerCase();
            if(bar == msg){
                $(this).parent().parent().show(); 
                c++;
            }
        });     
        $('#tot').text(c);
        $('#barre2').val('') ;
    });
