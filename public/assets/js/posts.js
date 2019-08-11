//方ajax获得文章列表数据
$.ajax({
    type: 'get',
    url: '/posts',
    success: function (res) {
        // console.log(res);

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

//处理时间格式
function formDate(date) {
    //将字符串的时间日期格式转换成日期对象
    date = new Date(date);
    //返回一个 xxx-xx-xx的日期格式
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate();
}

//当点击分页时就触发函数
function changePage() {
    //发送ajax请求  获取文章列表数据
    $.ajax({
        type: 'get',
        url: '/posts',
        // page:'5',
        // size:'5',
        data: {
            page: page
        },
        success: function (res) {
            console.log(res);
            //res返回的是一个数组,是所有的信息集合
            let html = template('poPid', res);
            // console.log(html);
            $('#postBox').html(html);
            // 将信息集合放入模板中
            let page = template('pagePid', res);
            // console.log(html);

            //放入ul中
            $('#page').html(page)
        }
    })
}