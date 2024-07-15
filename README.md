# 简要介绍

## 实验内容

+ 这是一个测量stroop效应的心理学按键反应实验

## 工具

+ VScode:使用该工具进行html,css以及js文件的代码书写
+ JsPsych:使用该工具，引入心理学实验程序的插件
+ Typora:使用该工具，进行markdown文件的书写

## JavaScript文件代码

### STEP 1

我们需要初始化jsPsych库，准备开始实验。代码如下:

```javascript
let jsPsych=initJsPsych();
```

### STEP 2

设置指导语,并将该段指导语设置为:黑色、实线、首行缩进两个字符,以及将"单字为红色时........请按任意键开始实验"设置为水平居中

```javascript
let trial1={
    // 设置试验类型为键盘响应。
    type:jsPsychHtmlKeyboardResponse,
    // 这里是一个包含实验说明的HTML段落。
    stimulus:`<p id="p1" style="color:black;font-weight:bold;font-size:20px;text-align:left;text-indent:2em;">欢迎参加我们的实验，接下来屏幕上会显示一系列描述颜色的单字，请忽略其字义，专注于字的颜色，你需要对单字的颜色做出按键反应，单字会呈现在屏幕的中央。按键反应规则如下：</p>
    <p id="p2" style="color:black;font-weight:bold;font-size:20px;text-align:center;">
    当单字为红色时，请按<strong>F</strong> 键
    <br>当单字为蓝色时，请按<strong>J</strong>键 
    <br>请按任意键开始实验</p>`,   
};
```

### STEP 3

设置练习阶段以及正式实验阶段的试次

- 练习阶段:使用loop_function设置练习阶段重复条件,即被试在练习中的正确率低于100%，练习将重复进行(练习试次共3个)

```javascript
let practice = {
    // 设置试验类型为jsPsychHtmlKeyboardResponse，专门用于处理HTML刺激和键盘响应。
    type: 'jsPsychHtmlKeyboardResponse',

    timeline: [
        // 定义第一个试验，一个提示信息，提示用户按空格键开始练习。
        { 
            // 'stimulus' 属性定义了要显示给用户的刺激，这里是一段文本。
            stimulus: '按空格键开始练习',
            // 'choices' 属性定义了允许用户响应的按键，这里只允许空格键。
            choices: [' '],
        },
        
        // 定义第二个试验，是一个嵌套的timeline，包含一系列连续的试验步骤。
        {
            timeline: [
                // 第一个步骤是一个短暂的刺激，显示 '+' 符号，不响应任何按键，持续300毫秒。
                {
                    stimulus: '+',
                    choices: 'NO_KEYS',
                    trial_duration: 300
                },
                // 第二个步骤显示颜色单词，用户根据颜色按键响应。
                {
                    // 使用jsPsych.timelineVariable来动态设置显示的内容。
                    stimulus: jsPsych.timelineVariable('content'),
                    // 定义有效的响应键为 'f' 和 'j'。
                    choices: ['f', 'j'],
                    // 'on_finish' 函数在试验结束时执行，用于记录用户响应是否正确。
                    on_finish: function(data) {
                        // 获取当前试验的正确响应键。
                        let correct = jsPsych.timelineVariable('correct', true);
                        // 将用户响应与正确响应进行比较，并记录结果。
                        data.correct = (data.response === correct);
                    },
                },
            ],
            // 'timeline_variables' 定义了嵌套timeline中变量的具体值。
            timeline_variables: [
                // 定义了三个变量，每个变量包含 'content' 和 'correct' 属性。
                { content: `<p style="color:red;font-weight:bold;font-size:120px;">红</p>`, correct: 'f' },
                { content: `<p style="color:red;font-weight:bold;font-size:120px;">蓝</p>`, correct: 'f' },
                { content: `<p style="color:blue;font-weight:bold;font-size:120px;">蓝</p>`, correct: 'j' },
            ],
            // 'randomize_order' 确保每次试验的顺序都是随机的。
            randomize_order: true,
        },
    ],
    // 'loop_function' 定义了一个函数，用于决定是否重复练习。
    loop_function: function() {
        // 获取所有 'html-keyboard-response' 类型的试验数据。
        let practice_data = jsPsych.data.get().filter({ trial_type: 'html-keyboard-response' }).values();
        // 计算正确响应的试验数量。
        let correct_trials = practice_data.filter(trial => trial.correct).length;
        // 在控制台打印练习数据和正确响应的试验数量。
        console.log("Practice Data:", practice_data);
        console.log("Correct Trials:", correct_trials);
        // 如果正确响应的试验少于3次，则返回true，表示需要重复练习。
        return correct_trials < 3;
    }
};
```

- 正式实验阶段:当被试练习阶段正确率达到100%时,进行正式实验阶段,实验阶段的content刺激样式有:<font color=red>红</font><font color=red>蓝</font><font color=Blue>蓝</font><font color=Blue>白</font><font color=Blue>红</font><font color=red>白</font>,并随机呈现13次

```javascript
let trial2={

 type:jsPsychHtmlKeyboardResponse,
 stimulus:'正式实验阶段，请按任意键开始'
 };
let trials={
    // 设置试验类型为键盘响应。
    type:jsPsychHtmlKeyboardResponse,
    timeline:[
        // 第一个时间点，显示一个占位符，不需要任何按键反应，持续300毫秒。
        {stimulus:'+', choices:'NO_KEYS',trial_duration:300},
         // 第二个时间点，显示颜色单字，用户根据颜色按键响应。
        {
            stimulus:jsPsych.timelineVariable('content'),choices:['f','j'],
            is_html: true,
            // 定义试验结束后的回调函数，用于处理用户响应。
            on_finish: function(data) {
                var correct = jsPsych.timelineVariable('correct',true);
                var response = data.response;
                var feedback = (response === correct) ? 
                    '<p style="color:green;">正确！</p>' : 
                    '<p style="color:red;">错误！</p><p style="color:red;">正确答案是 "' + correct + '"。</p>';
                    // 将反馈信息添加到数据中。
                jsPsych.data.addDataToLastTrial({feedback: feedback});
            }
        },
        // 第三个时间点，显示反馈信息，持续500毫秒。
              {  type:jsPsychHtmlButtonResponse,
                stimulus: function() {
             return jsPsych.data.get().last(1).values()[0].feedback;},
             choices:[],
             is_html: true,
             trial_duration: 500,   
            }
    ],
    // 定义时间线变量，即试验中将变化的内容。
    red
    timeline_variables:[
        // 定义每个试验变量的具体内容和正确答案。
       {content:`<p style="color:red;font-weight:bold;font-size:120px;">红</p>`,
        correct:'f',
        
       }
       , 
      {content:
         `<p style="color:red;font-weight:bold;font-size:120px;">蓝</p>`,
         correct:'f',
        },
      {content:
       `<p style="color:blue;font-weight:bold;font-size:120px;">蓝</p>`,
       correct:'j',
       
      },
      {content:
         `<p style="color:blue;font-weight:bold;font-size:120px;">白</p>`,
         correct:'j',
       
      },
      {content:
        `<p style="color:blue;font-weight:bold;font-size:120px;">红</p>`,
        correct:'j',
       
      },
      {content:
        `<p style="color:red;font-weight:bold;font-size:120px;">白</p>`,
        correct:'j',
       
      },
      {content:`<p style="color:red;font-weight:bold;font-size:120px;">红</p>`,
        correct:'f',
        
       }, 
      {content:
         `<p style="color:red;font-weight:bold;font-size:120px;">蓝</p>`,
         correct:'f',
        },
      {content:
       `<p style="color:blue;font-weight:bold;font-size:120px;">蓝</p>`,
       correct:'j',
       
      },
      {content:
         `<p style="color:blue;font-weight:bold;font-size:120px;">白</p>`,
         correct:'j',
       
      },
      {content:
        `<p style="color:blue;font-weight:bold;font-size:120px;">红</p>`,
        correct:'j',
       
      },
      {content:
        `<p style="color:red;font-weight:bold;font-size:120px;">白</p>`,
        correct:'j',
       
      },

    ],
    // 将试验顺序随机化。
    randomize_order: true,
    
 
};
let endtrial={

  type:jsPsychHtmlKeyboardResponse,
  stimulus:'您已经完成所有实验内容',
  choices:'NO_KEYS',trial_duration:500,
};
```

### STEP 4

启动实验

```javascript
// 启动实验，运行包含trial1和trials等的试验序列。

jsPsych.run([trial1,practice,trial2, trials,endtrial]);
```

### STEP 5

收集被试数据,将被试实验数据文件名设置为"data.csv",在全部试次结束之后下载保存(包括被试的反应时以及正确率)

```javascript
let jsPsych=initJsPsych(
on_finish:function() {
    jsPsych.data.get().localSave('csv','data.csv');
 }
);
```

## html文件代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
     <!-- 定义文档类型为HTML5，并设置页面语言为英文 -->
    <meta charset="UTF-8">
    <!-- 确保页面在不同设备上正确显示 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- 引入jsPsych库，用于创建心理学实验 -->
    <script src="https://unpkg.com/jspsych@7.3.4"></script>
    <!-- 引入jsPsych的HTML键盘响应插件 -->
    <script src="https://unpkg.com/@jspsych/plugin-html-keyboard-response@1.1.3"></script>
     <!-- 引入jsPsych的HTML按钮响应插件 -->
    <script src="https://unpkg.com/@jspsych/plugin-html-button-response@1.2.0"></script>
     <!-- 引入jsPsych的CSS样式 -->
    <link href="https://unpkg.com/jspsych@7.3.4/css/jspsych.css" rel="stylesheet" type="text/css" />
    
    <style>
        /* 自定义样式，使用Flexbox布局 */
        #jspsych-experiment {
             /* 使用Flexbox布局模型，使得子元素可以更加灵活地排列和对齐 */
            display: flex;
             /* 设置flex容器的主轴方向为垂直方向，即从上到下排列子元素 */
            flex-direction: column;
             /* 确保所有子元素在主轴方向上居中对齐 */
            align-items: center;
             /* 确保所有子元素在垂直方向上居中 */
            justify-content: center;
             /* 设置容器的高度为视口的100%，即占满整个屏幕高度 */
            height: 100vh;
             /* 移除容器的外边距 */
            margin:0;
            /* 设置容器边框的圆角为10px */
            border-radius: 10px;
            /* 设置容器边框样式为灰色的凹边 */
            border:1px inset grey;
/* 设置背景颜色为半透明的深灰色，RGBA颜色模式允许设置透明度 */
            background-color:rgba(32, 30, 30, 0.079);

        }
    
    </style>
</head> 
<body>
    <div id="jspsych-experiment">
        <!-- 实验内容将通过JsPsych动态添加 -->
    </div>
 <script src="./mian.js" defer></script>   
   <!-- 页面底部添加了一个固定位置的段落，显示为绿色，使用楷体字体，大小为24px -->  
  <p style="color:green;position:fixed;right:15px;bottom:15px;font-family:'KaiTi';font-size:24px;">logo:鱼头</p>  
</body>
</html> 
```

:o:**值得注意的是**,这种方式是将​css样式直接写在html文件代码中

## css文件代码

```css
#jspsych-experiment {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    
    margin:0;
    border-radius: 10px;
    
    border:1px inset grey;

    background-color:rgba(32, 30, 30, 0.079);

}
```

在我的实验中，我选择引入外部css文件，则需要在html文件的head部分加入，如下代码：

```html
 <link rel="stylesheet" href="./yanshi.css"
       >
 <!-- 引入名为yanshi的外部css文件 -->
```

