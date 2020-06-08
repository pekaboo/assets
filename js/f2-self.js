/* layui进度条
*  需要引入      <link rel="stylesheet" href="https://rpt-admin.j-net.cn/layui/css/layui.css"/>
                          <script type="text/javascript" charset="utf-8" src="https://rpt-admin.j-net.cn/layui/layui.all.js"></script>
* */
function showLoad() {
    //   var msg = ['拼命拉取数据中...','请君稍等片刻儿...'];
    //   return layer.msg((function(){return msg[Math.floor((Math.random()*2)+1)]})(), {icon: 16,shade: [0.6, '#f5f5f5'],scrollbar: false,offset: 'auto', time:100000});
    //   return layer.msg('拼命拉取数据中...', {icon: 16,shade: [0.6, '#f5f5f5'],scrollbar: false,offset: '320px', time:100000});
    return layer.msg('拼命拉取数据中...', {icon: 16,shade: [0.6, '#f5f5f5'],scrollbar: false,offset: '320px', time:100000});
}
function closeLoad(index) {
    layer.close(index);
}

/* date begin
*
* */
function getDay(num, str) {
    var today = new Date();
    var nowTime = today.getTime();
    var ms = 24*3600*1000*num;
    today.setTime(parseInt(nowTime + ms));
    var oYear = today.getFullYear();
    var oMoth = (today.getMonth() + 1).toString();
    if (oMoth.length <= 1) oMoth = '0' + oMoth;
    var oDay = today.getDate().toString();
    if (oDay.length <= 1) oDay = '0' + oDay;
    return oYear + str + oMoth + str + oDay;
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//获取前一个月的日期
//入参格式：YYYY-MM-DD
function getPreMonthDay(date) {
    var arr = date.split('-');
    var year = arr[0];     //当前年
    var month = arr[1];      //当前月
    var day = arr[2];        //当前日
    //验证日期格式为YYYY-MM-DD
    // var reg = date.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/);
    // if ((!reg) || (month > 12) || (day > 31)) {
    //     console.log('日期或格式有误！请输入正确的日期格式（年-月-日）');
    //     return;
    // }
    var pre_year = year;     //前一个月的年
    var pre_month = parseInt(month) - 1;      //前一个月的月，以下几行是上月数值特殊处理
    if (pre_month === 0) {
        pre_year = parseInt(pre_year) - 1;
        pre_month = 12;
    }
    var pre_day = parseInt(day);       //前一个月的日，以下几行是特殊处理前一个月总天数
    var pre_month_alldays = (new Date(pre_year, pre_month, 0)).getDate();    //巧妙处理，返回前一个月的总天数
    if (pre_day > pre_month_alldays) {
        pre_day = pre_month_alldays;
    }
    if (pre_month < 10) {   //补0
        pre_month = '0' + pre_month;
    }
    if (pre_day < 10) {   //补0
        pre_day = '0' + pre_day;
    }

    var pre_month_day = pre_year + '-' + pre_month + '-' + pre_day;
    return pre_month_day;
}
/* date end*/

function formatNumber(n) {
    return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


/*  f2 pie
* 需要引入
    <script src="https://gw.alipayobjects.com/os/antv/assets/f2/3.4.2/f2-all.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.4/lodash.min.js"></script>
* json:json 数组
* id: 显示的convas id
* title： 名称字段
* value： 值字段
* num：只显示前多少个
* ext: “第#章”
* eg:   loadPieExt(data.data.sources,'b-source','SOURCE','PS',7,'#票')
* */
function loadPie(json,id,title,value,num,ext='#'){
    const data = [];
    var sum= 0 ;
    for( j = 0,len=json.length; j < len; j++){
        if (j<num-1){
            data.push({
                'title':json[j][title],
                'value':json[j][value],
                'const':'const'
            });
        }else{
            sum = sum+ json[j][value];
        }
    }
    if (sum>0){
        data.push({
            'title':'其他',
            'value':sum,
            'const':'const'
        });
    }

    const chart = new F2.Chart({
        id: id,
        pixelRatio: window.devicePixelRatio
    });

    chart.source(data);
    chart.coord('polar', {
        transposed: true,
        radius: value
    });
    chart.legend(false);
    chart.axis('', { label: {  } });
    chart.tooltip(false);

    // 添加饼图文本
    chart.pieLabel({
        sidePadding: 40,
        label1: function label1(data, color) {
            return {
                text: data.title,
                fill: color
            };
        },
        label2: function label2(data) {
            text = ext.replace("#",formatNumber(data.value))
            return {
                text:  text,
                fill: '#808080',
                fontWeight: 'bold'
            };
        }
    });

    chart.interval()
        .position('const*value')
        .color('title', [ '#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864' ])
        .adjust('stack');
    chart.render();

}
/*
*  柱状图
  * loadZhu(data.data.month,'z-rk','MM','AMOUNT','YY-MM','#%',12); 显示结尾12个数
* */
function loadZhu(json,id,title,value,fmt='MM-DD',ext='#',show=12){
    const data = []
    for( j = 0,len=json.length; j < len; j++){
        data.push({
            'title':json[j][title],
            'value':json[j][value],
            'first':true,
        });
    }
    const originTitles = [];
    const originValues = [];
    // data.forEach(function(obj) {
    //     if (obj.title >= getDay(-10, '-')) {
    //         originTitles.push(obj.title);
    //         originValues.push(obj.value);
    //     }
    // });
    for(var i=(data.length<show?0:data.length-show); i<data.length ;i++){
        originTitles.push(data[i].title);
        originValues.push(data[i].value);
    }


    const chart = new F2.Chart({
        id: id,
        pixelRatio: window.devicePixelRatio
    });

    chart.source(data, {
        title: {
            tickCount: 5,
            type: 'timeCat',
            values: originTitles,
            mask: fmt
        },
        value: {
            tickCount: 5
        }
    });

    chart.axis('title', {
        tickLine: {
            length: 4,
            stroke: '#cacaca'
        },
        label: {
            fill: '#cacaca'
        },
        line: {
            top: true
        }
    });
    chart.axis('value', {
        position: 'right',
        label: function label(text) {
            return {
                text: formatNumber(text * 1),
                fill: '#cacaca'
            };
        },

        grid: {
            stroke: '#d1d1d1'
        }
    });
    chart.tooltip({
        showItemMarker: false,
        background: {
            radius: 2,
            padding: [ 3, 5 ]
        },
        onShow: function onShow(ev) {
            const items = ev.items;
            items[0].name =  items[0].title;
            items[0].value = ext.replace("#",items[0].value);
        }
    });
    chart.interval().position('title*value').style({
        radius: [ 2, 2, 0, 0 ]
    });

    // 定义进度条
    chart.scrollBar({
        mode: 'x',
        xStyle: {
            backgroundColor: '#e8e8e8',
            fillerColor: '#808080',
            offsetY: -1
        }
    });
    chart.interaction('pan');
    chart.render();
}


//半圆进度条  eg: loadHalfCircle('b-outorder','今天完成',20);
//需要引入 jq      <script src='//cdn.bootcss.com/jquery/3.1.1/jquery.min.js'></script>
function loadHalfCircle(id,title,value){
    var _F = F2,
        Shape = _F.Shape,
        G = _F.G,
        Util = _F.Util,
        Global = _F.Global;
    var Vector2 = G.Vector2;

    // 极坐标下带圆角的柱子，只对极坐标生效
    Shape.registerShape('interval', 'polar-tick', {
        draw: function draw(cfg, container) {
            var points = this.parsePoints(cfg.points);
            var style = Util.mix({
                stroke: cfg.color
            }, Global.shape.interval, cfg.style);

            var newPoints = points.slice(0);
            if (this._coord.transposed) {
                newPoints = [points[0], points[3], points[2], points[1]];
            }

            var center = cfg.center;
            var x = center.x,
                y = center.y;


            var v = [1, 0];
            var v0 = [newPoints[0].x - x, newPoints[0].y - y];
            var v1 = [newPoints[1].x - x, newPoints[1].y - y];
            var v2 = [newPoints[2].x - x, newPoints[2].y - y];

            var startAngle = Vector2.angleTo(v, v1);
            var endAngle = Vector2.angleTo(v, v2);
            var r0 = Vector2.length(v0);
            var r = Vector2.length(v1);

            if (startAngle >= 1.5 * Math.PI) {
                startAngle = startAngle - 2 * Math.PI;
            }

            if (endAngle >= 1.5 * Math.PI) {
                endAngle = endAngle - 2 * Math.PI;
            }

            var lineWidth = r - r0;
            var newRadius = r - lineWidth / 2;

            return container.addShape('Arc', {
                className: 'interval',
                attrs: Util.mix({
                    x: x,
                    y: y,
                    startAngle: startAngle,
                    endAngle: endAngle,
                    r: newRadius,
                    lineWidth: lineWidth,
                    lineCap: 'round'
                }, style)
            });
        }
    });
    var data = [{
        const: 'a',
        actual: value,
        expect: 100
    }];
    var chart = new F2.Chart({
        id: id,
        padding: [0, 30, 60],
        pixelRatio: window.devicePixelRatio
    });
    chart.source(data, {
        actual: {
            max: 100,
            min: 0,
            nice: false
        }
    });
    chart.coord('polar', {
        transposed: true,
        innerRadius: 0.8,
        startAngle: -Math.PI,
        endAngle: 0
    });
    chart.axis(false);
    chart.interval().position('const*expect').shape('polar-tick').size(10).color('rgba(240,240,240, 0.95)').animate(false); // 背景条
    chart.interval().position('const*actual').shape('polar-tick').size(10).color('#1E9FFF').animate({
        appear: {
            duration: 1100,
            easing: 'linear',
            animation: function animation(shape, animateCfg) {
                var startAngle = shape.attr('startAngle');
                var endAngle = shape.attr('endAngle');
                if (startAngle > endAngle) {
                    // -Math.PI/2 到 0
                    endAngle += Math.PI * 2;
                }
                shape.attr('endAngle', startAngle);
                shape.animate().to(Util.mix({
                    attrs: {
                        endAngle: endAngle
                    }
                }, animateCfg)).onUpdate(function(frame) {
                    $('.text-'+id).text(parseInt(frame * value) + '%');
                });
            }
        }
    }); // 实际进度
    chart.guide().html({
        position: ['50%', '80%'],
        html: '<div style="width: 120px;color: #FEC556;white-space: nowrap;text-align:center;">' + '<p style="font-size: 18px;margin:0;">'+title+'</p>' + '<p class="text-'+id+'" style="font-size: 30px;margin:0;font-weight: bold;">0</p>' + '</div>'
    });
    chart.render();
}

//折线图 对比折线图  https://f2.antv.vision/zh/examples/line/multiple
function loadZheMulty(json,id,title,value,type,fmt='MM-DD',ext='#'){
    const data = []
    for( j = 0,len=json.length; j < len; j++){
        data.push({
            'title':json[j][title],
            'value':json[j][value],
            "type": json[j][type]
        });

    }

    const chart = new F2.Chart({
        id: id,
        pixelRatio: window.devicePixelRatio
    });
    chart.source(data);
    chart.scale('title', {
        type: 'timeCat',
        tickCount: 3,
        mask: fmt
    });
    chart.scale('value', {
        tickCount: 5
    });
    chart.axis('title', {
        label: function label(text, index, total) {
            // 只显示每一年的第一天
            const textCfg = {};
            if (index === 0) {
                textCfg.textAlign = 'left';
            } else if (index === total - 1) {
                textCfg.textAlign = 'right';
            }
            return textCfg;
        }
    });
    chart.tooltip({
        custom: true, // 自定义 tooltip 内容框
        onChange: function onChange(obj) {
            const legend = chart.get('legendController').legends.top[0];
            const tooltipItems = obj.items;
            const legendItems = legend.items;
            const map = {};
            legendItems.forEach(function(item) {
                map[item.name] = _.clone(item);
            });
            tooltipItems.forEach(function(item) {
                const name = item.name;
                const value = ext.replace("#",item.value)+'('+item.title+')';
                if (map[name]) {
                    map[name].value = value;
                }
            });
            legend.setItems(_.values(map));
        },
        onHide: function onHide() {
            const legend = chart.get('legendController').legends.top[0];
            legend.setItems(chart.getLegendItems().country);
        }
    });
    chart.line().position('title*value').color('type');
    chart.render();

}

//折线图
function loadZhe(json,id,title,value,fmt='MM-DD',ext='#'){
    const data = []
    for( j = 0,len=json.length; j < len; j++){
        data.push({
            'title':json[j][title],
            'value':json[j][value]
        });
    }

    console.log(data)
    // const min = data[data.length-show-1].release;
    // const max = data[data.length-1].release;

    const chart = new F2.Chart({
        id: id,
        pixelRatio: window.devicePixelRatio
    });
    chart.source(data, {
        title: {
            // min: min,
            // max: max,
            type: 'timeCat',
            mask: fmt
        }
    });
    chart.tooltip({
        showCrosshairs: true,
        showItemMarker: true,
        background: {
            radius: 2,
            fill: '#595959',
            padding: [ 3, 5 ]
        },
        nameStyle: {
            fill: '#fff'
        },
        onShow: function onShow(ev) {
            const items = ev.items;
            items[0].name = items[0].title;
            items[0].value = ext.replace("#",items[0].value);
        },

        // showCrosshairs: true,
        // custom: true,
        // showXTip: true,
        // showYTip: true,
        // snap: true,
        // crosshairsType: 'xy',
        // crosshairsStyle: {
        //     lineDash: [2]
        // }
    });
    chart.line().position('title*value');
    chart.point().position('title*value').style({
        lineWidth: 1,
        stroke: '#fff'
    });

    chart.interaction('pan');
    // 定义进度条
    chart.scrollBar({
        mode: 'x',
        xStyle: {
            offsetY: -5
        }
    });

    // 绘制 tag
    chart.guide().tag({
        position: [ 1969, 1344 ],
        withPoint: false,
        content: '1,344',
        limitInPlot: true,
        offsetX: 5,
        direct: 'cr'
    });
    chart.render();

}