


//没有传参则显示所有的 分类和所有的状态
render();

//封装函数
function render(c = "all", s = "all", page = 1) {
    // console.log(123456);

    //方ajax获得文章列表数据
    $.ajax({
        type: 'get',
        url: '/posts',
        data: {
            page: page, //页码
            category: c, //分类名称
            state: s   //分类状态
        },
        success: function (res) {

            // console.log(res);
            //获取当前页码,并开放到全局当中,这样全局都可以拿到此参数
            window.currentPage = res.page
            // console.log(currentPage);

            //res返回的是一个数组,是所有的信息集合
            let html = template('poPid', res);
            // console.log(html);
            $('#postBox').html(html);
            //翻页
            let page = template('pagePid', res);
            // console.log(html);

            //放入ul中
            $('#page').html(page)

        }

    });
}


//处理时间格式
function formDate(date) {
    //将字符串的时间日期格式转换成日期对象
    date = new Date(date);
    //返回一个 xxx-xx-xx的日期格式
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate();
}

//当点击分页时就触发函数
function changePage(page) {

    let s = $('#s').val();
    let c = $('#categoryBox').val();
    render(c, s, page)

}

//筛选分类


$.ajax({
    type: 'get',
    url: '/categories',
    success: function (res) {
        // console.log(res);
        //拼接模板
        let html = template('sShearch', { data: res });
        // console.log(html);
        //将拼接好的字符串放入select选项卡中
        $('#categoryBox').append(html);
    }
});

//给筛选按钮绑定点击事件
$('#sBtn').on('click', function () {
    //获取筛选条件 获取到分类id与状态
    let s = $('#s').val();
    let c = $('#categoryBox').val();
    render(c, s);
})

var delId;
//根据id删除 通过事件委托 绑定事件
$('#postBox').on('click', '.del', function () {
    // console.log(123456);
    //确认是否删除
    if (confirm('您确定要删除嘛')) {
        //获取id
        delId = $(this).attr('data-id');
        // console.log(delId);

        //发送ajax
        $.ajax({
            type: 'delete',
            url: '/posts/' + delId,
            success: function (res) {
                console.log(res);
                //如果tbody标签下面的有标签 这个时候我们就让它在当前页码如果已经 已经大于1 我们应该让它回到前一页
                if ($('tbody').children().length > 1) {
                    let s = $('#s').val();
                    let c = $('#categoryBox').val();
                    // 如果当前页码已经是第一页了 我们就让他不跳转到前一页
                    if (currentPage == 1) {
                        render(c, s, currentPage);
                    } else {
                        render(c, s, currentPage - 1)
                    }
                } else {
                    render(c, s, currentPage - 1);
                }

            }
        });
    }
})
