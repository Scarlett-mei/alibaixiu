
//用于存放分类的数组
var cArr = new Array();

$('#cAdd').on('click', function () {
    // console.log($('#cForm').serialize());

    //添加分类 发送ajax
    $.ajax({
        type: 'post',
        url: '/categories',
        data: $('#cForm').serialize(),
        success: function (res) {
            console.log(res);

            cArr.push(res);
            render(cArr);

            //清空表单内容
            $('#cForm input').val('');
        }
    })
    //阻止表单的默认行为
    return false
})
//查询分类列表 展示分类 发送ajax
$.ajax({
    type: 'get',
    url: '/categories',
    success: function (res) {
        cArr = res;
        render(cArr)


    }
})

//用于调用template方法
function render(arr) {
    var str = template('cTpl', {
        list: arr
    });
    $('tbody').html(str);
}




//给复选按钮注册点击事件
$('tbody').on('click', 'input', function () {

    $('thead input').prop('checked', status);
    //当被选中的用户按钮数量等于用户数量时,全选按钮被点亮
    if ($('tbody input').length == $('tbody input:checked').length) {
        $('thead input').prop('checked', true)
    } else {
        $('thead input').prop('checked', false)
    };

    //当选到两个按钮的时候批量删除按钮显示出来
    if ($('tbody input:checked').length > 1) {
        // console.log(123456);
        $('.btn-sm').show();
    } else {
        $('.btn-sm').hide();
    };


})

//编辑功能 
var cId;
//通过实现委托的方式从tbody来为编辑按钮添加点击事件
$('#cTbody').on('click', '.edit', function () {
    //获取元素
    var title = $(this).parents('tr').children().eq(1).text();
    var className = $(this).parents('tr').children().eq(2).text();
    //保存当前被修改的用户的id
    cId = $(this).parent().attr('data-id');
    //将获取到的元素放入
    $('#title').val(title);
    $('#className').val(className);
    $('#cAdd').hide();
    $('#cEdit').show();
});

//完善编辑功能,给cEdit绑定点击事件
$('#cEdit').on('click', function () {
    //发送ajax请求
    $.ajax({
        type: 'put',
        url: '/categories/' + cId,
        data: $('#cForm').serialize(),
        success: function (res) {
            //我们要从userArry这个数组中将要修改的这个数组元素找出来
            var index = cArr.findIndex(item => item._id == cId);

            //根据index找到的元素,将其更新
            cArr[index] = res;

            //调用render方法重新渲染页面
            render(cArr);

            //修改完之后将表单内的内容清空
            $('#cForm input').val('');
            $('#cAdd').show();
            $('#cEdit').hide();
        }
    })
})

//删除功能
//给tbody绑定事件通过事件委托来为删除按钮添加事件
$('#cTbody').on('click', '.delete', function () {
    //弹出确认框确认是否删除
    if (window.confirm('确认要删除嘛')) {
        //拿到删除按钮的id
        cId = $(this).parent().attr('data-id');
        //发送ajax
        $.ajax({
            type: 'delete',
            url: '/categories/' + cId,
            success: function () {
                //拿到当前点击的删除按钮的id
                let index = cArr.findIndex(item => item._id == cId);

                //根据索引删掉一个内容
                cArr.splice(index, 1);

                //调用render方法重新渲染页面
                render(cArr);
            }
        })
    }
})

//给全选按钮注册点击事件
var ckeckAll = $('#ckeckAll')
//当全选按钮被选中时
ckeckAll.on('change', function () {
    //获取到全选按钮当前的状态
    var status = $(this).prop('checked')
    //  console.log(status);
    //使所有的用户选定状态保持一致
    $('tbody input').prop('checked', status);

    // //删除选中复选框中的选项
    // $('tbody input:checked').parent('tr').remove();
})

//给批量删除按钮注册点击事件
$('.btn-sm').on('click', function () {
    //获取被点击的按钮
    let delCheck = $('#cTbody input:checked');
    console.log(delCheck);
    let arr = new Array();
    delCheck.each(function (index, value) {
        // console.log(value);
        let inputId = $(value).parent().siblings('.text-center').attr('data-id');
        // console.log(inputId);
        arr.push(inputId);
    })
    //    console.log(arr);
    //判断是否删除
    if(confirm('确定要删除嘛')){
    //发送ajax
    $.ajax({
        type: 'delete',
        url: '/categories/' + arr.join('-'),

        success: function (res) {
            // console.log(123456);
            console.log(res);
            
            res.each(function (k) {
                //拿到当前点击的删除按钮的id
                let index = cArr.findIndex(item => item._id == k_id);

                //根据索引删掉一个内容
                cArr.splice(index, 1);

            })
              //调用render方法重新渲染页面
              render(cArr);

        }
    })
}else {
    return
}



})
