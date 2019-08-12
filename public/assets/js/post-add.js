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
        url: '/upload',
        data: formData,
        //告诉ajax方法不要处理data属性对应的参数
        processData: false,
        //告诉ajax不要设置参数类型
        contentType: false,
        success: function (res) {
            // console.log(res);
            
            $('#thumbnail').val(res[0].cover);
            $('#prev').show().attr('src', res[0].cover);
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

//根据是否有id判断是添加文章还是修改文章

//获取浏览器地址栏中的id参数
var id = getUrl('id');
//当管理员是在修改文章
if (id != -1) {
    //发送ajax 获得在这篇文章的相关信息
    $.ajax({
        type: 'get',
        url: '/posts/' + id,
        success: function (res) {
            console.log(res);
            $('#addPost').hide();
            $('#editPost').show();
            $('h1').html('修改文章')
         
            //获取res返回的文章信息中的内容显示在表单中
            $('#title').val(res.title);
            $('#content').val(res.content);
            //需要加此自定义属性才可以截取时间
            $('#created').attr('type', 'date');
            // console.log(res.createAt.split('T'));
            //截取事件格式后返回的是数组,我们只需要年月日即第一个元素[0]
            $('#created').val(res.createAt.split('T')[0]);

            //获取#category下面所有的option标签 所属分类
            let coption = $('#category > option');
            //  console.log(coption);
            //循环option
            coption.each(function (index, item) {
                // console.log(item); //是所有的分类及其id

                //将item这个对象转换为jQuery
                // console.log($(item).attr("value"),res.category);
                //将每一个循环出来的id和res回来的id进行对比,如果相等则选中改数组即item
                if ($(item).attr("value") == res.category) {
                    $(item).prop('selected', true);
                };
            });
            // 获取status下面所有的option标签 为状态筛选
            let soption = $('#status> option');
            // console.log(soption);
            soption.each(function(index,item){
                // console.log(item);//是所有的分类及其id
                // console.log($(item).attr("value") ,res.state);
                
                if($(item).attr("value") == res.state){
                    $(item).prop('selected',true);
                }        
            })


           //将返回的图片格式传入隐藏域
            $('#thumbnail').val(res.thumbnail);
            $('#prev').show().attr('src', res.thumbnail);

        }
    })
}

//编辑注册点击事件
$('#editPost').on('click',function(){
      //获取表单中输入的内容
      let msg = $('#addForm').serialize();
    //   console.log(msg);
    // 发送ajax请求数据
    $.ajax({
        type:'put',
        url:'/posts/'+id,
        data:msg,
        success:function(){
            location.href = '/admin/posts.html';
        }
    })
      
})




//从浏览器的地址栏中获取参数
function getUrl(name) {
    //  console.log( location.search.substr(1).split('&'));  //查询的是浏览器中的id
    let parmData = location.search.substr(1).split('&');

    //循环parmData数组
    for (var i = 0; i < parmData.length; i++) {
        let tem = parmData[i].split('=');
        if (tem[0] == name) {
            return tem[1]
        }
    }
    return -1;
}


