//获取发文章分类数据
$.ajax({
    type: 'get',
    url: '/categories',
    success: function (res) {
        // console.log(res);
        //拼接模板
        let html = template('pTpl', { data: res });
        // console.log(html);
        //将拼接好的字符串放入select选项卡中
        $('#category').html(html);
    }
})

//显示文字封面图片的上传功能,然后把图片的路径放在隐藏域中
//给选择文件的控件绑定事件
$('#feature').on('change', function () {
    //获取到上传的选择文件,不管上传多少个文件都是一个数组,我们永远取得是第一个文件
    let file = this.files[0];

    //创建formData对象实现二进制文件
    let formData = new FormData();

    //将选择到的文件追加到formData对象中 cover是自定义的是图片地址
    formData.append('cover', file);

    //发送ajax
    $.ajax({
        type: 'post',
		url: '/posts',
		data: formData,
        //告诉ajax方法不要处理data属性对应的参数
        processData: false,
        //告诉ajax不要设置参数类型
        contentType: false,
        success: function (res) {
            $('#thumbnail').val(res[0].cover);
        }
    })
})

//添加文章,给表单绑定事件
$('#addForm').on('submit', function () {
    //获取表单中输入的内容
    var formData = $(this).serialize();
    // console.log(formData);

    // 发送ajax
    $.ajax({
        type: 'post',
        url: '/posts',
        data: formData,
        success: function () {
            console.log(123456);
            
            // 成功之后重定向到文章列表页面
            location.href = '/admin/posts.html'

        }
    })
    //阻止表单的默认行为
    return false;
})
