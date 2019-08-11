$('#reSetPassword').on('submit',function(){
    // alert('ok')
    var formData = $(this).serilaze();

    $.ajax({
        type:'put',
        url:'/users/password',
        data:formData,
        success:function(){
            location.href="/admin/login.html"
        }
    })
})