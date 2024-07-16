// 初始化jsPsych库，准备开始实验。
let jsPsych=initJsPsych({display_element:'jspsych-experiment'
,

on_finish:function() {
    jsPsych.data.get().localSave('csv','data.csv');
 }}
);


// 定义第一个试验trial1，这是一个键盘响应试验。
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

let practice={
  type:jsPsychHtmlKeyboardResponse,

timeline:[
  { stimulus:'按空格键开始练习',choices:[' ']},



 {timeline:[
  {
    stimulus: '+', choices: 'NO_KEYS', trial_duration: 300 
  },
   {stimulus: jsPsych.timelineVariable('content'),choices:['f','j'],
    on_finish:function(data){
      let correct = jsPsych.timelineVariable('correct',true);
            data.correct = (data.response === correct);},
 },],
    
 timeline_variables: [
  { content: `<p style="color:red;font-weight:bold;font-size:120px;">红</p>`, correct: 'f' },
  { content: `<p style="color:red;font-weight:bold;font-size:120px;">蓝</p>`, correct: 'f' },
  { content: `<p style="color:blue;font-weight:bold;font-size:120px;">蓝</p>`, correct: 'j' },
],
randomize_order: true,
},],


loop_function:function(){
  
  let practice_data = jsPsych.data.get().filter({ trial_type: 'jsPsychHtmlKeyboardResponse' }).last(3).values();
  let correct_trials = practice_data.filter(trial => trial.correct).length;
  
  return correct_trials <3;
}

};




  

 let trial2={

 type:jsPsychHtmlKeyboardResponse,
 stimulus:'正式实验阶段，请按任意键开始'
 };
// 定义trials对象，这是一个包含多个试验的数组。
let trials={
    // 设置试验类型为键盘响应。
    
    type:jsPsychHtmlKeyboardResponse,
    timeline:[

     
        // 第一个时间点，显示一个占位符，不响应任何按键，持续300毫秒。
        {stimulus:'+', choices:'NO_KEYS',trial_duration:300},
         // 第二个时间点，显示颜色单词，用户根据颜色按键响应。
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
        // 第三个时间点，显示反馈信息，持续1000毫秒。
              {  type:jsPsychHtmlButtonResponse,
                stimulus: function() {
             return jsPsych.data.get().last(1).values()[0].feedback;},
             choices:[],
             is_html: true,
             trial_duration: 500,
                
                
            
               
            },
            
        
    ],
    // 定义时间线变量，即试验中将变化的内容。
    
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
        correct:'f',
       
      },
      {content:
        `<p style="color:red;font-weight:bold;font-size:120px;">红</p>`,
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
        correct:'f',
       
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
// 启动实验，运行包含trial1和trials的试验序列。

jsPsych.run([trial1,practice,trial2, trials,endtrial]);









