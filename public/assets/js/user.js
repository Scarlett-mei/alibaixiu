//此Js文件主要用于操作用户的

var userArr = new Array();
//将用户列表展示出来
$.ajax({
    type: 'get',
    url: '/users',
    success: function (res) {
        //将响应回来的元素放到新数组中去
        userArr = res;
        render(userArr);
    }
})

//用于调用template方法
function render(arr) {
    var str = template('userTpl', {
        list: arr
    });

    $('tbody').html(str);
}

//添加用户注册按钮
$('#userAdd').on('click', function () {
    //用户在表单中的
    var formData = $('#userForm').serialize();
    // console.log(formData);

    $.ajax({
        url: '/users',
        type: 'post',
        data: formData,
        success: function (res) {
            //把响应回来的东西添加到数组中
            userArr.push(res);
            render(userArr);
        }
    })

    //阻止表单的默认提交行为
    // return false
});
//显示用户头像
$('#avatar').on('change', function () {
    //用户选择到的文件
    var formData = new FormData();
    // console.log(this.files[0]);

    formData.append('avatar', this.files[0])

    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        //告诉$.ajax方法不要解析请求参数
        processData: false,

        //告诉$.ajax方法不要设置请求参数方式
        contentType: false,

        success: function (res) {
            //实现头像预览功能
            $('#preview').attr('src', res[0].avatar);

            //将图片地址添加到表单里面的隐藏域
            $('#hiddenAvatar').val(res[0].avatar);
        }
    })
})

var userId;
//通过实现委托的方式从tbody来为编辑按钮添加点击事件
$('#userBox').on('click', '.edit', function () {
    //保存当前被修改的用户的id
    userId = $(this).parent().attr('data-id')

    //修改h2标签的内容
    $('#userForm > h2').text('修改用户')

    //获取被点击用户的id值
    var trObj = $(this).parents('tr');
    $('#email').val(trObj.children().eq(2).text());
    $('#nickName').val(trObj.children().eq(3).text());

    //获取图片的地址
    var imgSrc = trObj.children(1).children('img').attr('src');
    //将图片的地址写入隐藏域
    $('#hiddenAvatar').val(imgSrc);

    //如果有图片则把图片写入编辑框,如果没有图片则使用默认图片
    if (imgSrc) {
        $('#preview').attr('src', imgSrc);
    } else {
        $('#preview').attr('src', "../assets/img/default.png");
    }

    //获取选择状态
    var status = trObj.children().eq(4).text();
    if (status == '激活') {
        $('#jh').prop('checked', true)
    } else {
        $('#wjh').prop('checked', true)
    }

    //获取角色选项
    var role = trObj.children().eq(5).text();
    if (role == '超级管理员') {
        $('#admin').prop('checked', true)
    } else {
        $('#normal').prop('checked', true)
    }

    //当我们点击编辑按钮时 将添加按钮隐藏 同时将修改按钮显示过来
    $('#userAdd').hide();
    $('#userEdit').show();
})

//完善编辑信息的功能
$('#userEdit').on('click', function () {

    //发送ajax请求
    $.ajax({
        type: 'put',
        url: '/users/' + userId,
        data: $('#userForm').serialize(),
        success: function (res) {
            //我们只是将数据库里面的数据修改了,但是我们将userArry这个数组里面的元素给修改
            //我们要从userArry这个数组中将要修改的这个数组元素找出来
            var index = userArr.findIndex(item => item._id == userId);

            //根据index找到的元素,将其更新
            userArr[index] = res;

            //调用render方法重新渲染页面
            render(userArr);

            //修改完之后将表单清空还原
            $('#userForm > h2').text('添加用户');
            $('#hiddenAvatar').val('');
            $('#preview').attr('src', "../assets/img/default.png");
            $('#userAdd').show();
            $('#userEdit').hide();
            $('#email').val('');
            $('#nickName').val('');
            $('#admin').prop('checked', false);
            $('#normal').prop('checked', false);
            $('#jh').prop('checked', false);
            $('#wjh').prop('checked', false)
        }

    })
})


//删除功能
$('tbody').on('click', '.del', function () {
    //先弹出一个弹窗 确实是否删除
    if (window.confirm('真的要删除吗')) {
        userId = $(this).parent().attr('data-id');
        //发送ajax
        $.ajax({
            type: 'delete',
            url: '/users/' + userId,
            success: function () {
                var index = userArr.findIndex(item => item._id == userId);
                 //根据索引删掉一个内容
                userArr.splice(index, 1);

                //调用render方法重新渲染页面
                render(userArr);
            }
        })
    }
})

//获取全选按钮
var selectAll = $('#selectAll');

//当全选按钮被选中时
selectAll.on('change', function () {
    //获取到全选按钮当前的状态
    var status = $(this).prop('checked');
    //获取到所有的用户使所有的用户选择状态保持一致
    $('#userBox').find('input').prop('checked', status);
})

$('thead input').on('click', function () {
    let flag = $(this).prop('checked');

})

//给下面的复选框注册点击事件
$('tbody').on('click', 'input', function () {
    //当被选中的用户按钮数量等于用户数量时,全选按钮被点亮
    if ($('tbody input').length == $('tbody input:checked').length) {
        $('thead input').prop('checked', true);
    } else {
        $('thead input').prop('checked', false);
    };

    //如果被选中的有两个用户则删除按钮显示出来,如果没有则隐藏
    if ($('tbody input:checked').length > 1) {
        $('.btn-sm').show();
    } else {
        $('.btn-sm').hide();
    }
})



//给批量删除按钮注册点击事件
$('.btn-sm').on('click', function () {
    var ids = [];
    //获取被选中ID元素的属性值
    var checkUser = $('tbody input:checked');
    //对checkuser对象进行遍历
    checkUser.each(function (k, v) {
        // 获得删除按钮的id
        var id = v.parentNode.parentNode.children[6].getAttribute('data-id');
        // 将获得的删除按钮的id放进空数组中
        ids.push(id)
    });
    // 发送ajax
    $.ajax({
        type: 'delete',
        url: '/users/' + ids.join('-'),
        success: function (res) {
            //res是一个数组,里面存放的是被删除的元素,元素时一个对象
            res.forEach(e => {
                var index = userArr.findIndex(item => item._id == e.id)
                //调用splice方法 删除元素
                userArr.splice(index, 1);
                render(userArr)
            })

            //   location.reload();


        }
    })
})