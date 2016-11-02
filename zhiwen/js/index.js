$(function(){
	//搜索
	$('#search_button').button({
		//添加搜索按钮图标
		icons:{
			primary:'ui-icon-search',
			//secondary:'ui-icon-triangle-1-s',
		},
	});

	/*提问
	点击提问按钮，验证是否登录，如果登录，打开提问对话框
	否则弹出错误提示，并且转到登录对话框*/
	$('#question_button').button({
		icons:{
			primary:'ui-icon-lightbulb',
			//secondary:'ui-icon-triangle-1-s',
		},
	}).click(function(){
		if ($.cookie('user')){
			$('#question').dialog('open');
		}else{
			$('#error').dialog('open');
			//window setTimeout()方法，在指定时间后调用函数
			setTimeout(function(){
				$('#error').dialog('close');
				$('#login').dialog('open');
			},1000);
		}
	});


	//注册：点击注册，弹出注册对话框
	$("#reg_a").click(function(){
		$('#reg').dialog('open');
	});
	//注册对话框设置
	$("#reg").dialog({
		autoOpen:false,			//隐藏，禁止自动弹出
		modal:true,				//对话框意外禁止操作
		width:320,
		height:340,
		resizable:false,		//不能改变大小
		draggable:false,		//不能拖动
		buttons:{				//添加提交取消按钮
			'提交':function(){
				$(this).submit();//提交事件，只用于form元素
			},
			'取消':function(){
				$(this).dialog('close');
			}
		},
	}).buttonset().validate({			//jq-ui设置按钮样式;验证插件

		/*当表单验证成功并提交时执行，存在此方法时表单只能在此方法内部执行form.su
		bmit()才能提交，在此处可以理解为用ajax方法替代了表单的onsubmit方法；*/
		submitHandler:function(form){
			$(form).ajaxSubmit({
				url:'php/add.php',
				type:'POST',
				//beforeSubmit会在表单提交前被调用，如果beforeSubmit返回false，则会阻止表单提交
				beforeSubmit:function(formData,jqForm,options){
					$('#loading').dialog('open');			//数据交互提示
					$('#reg').dialog('widget').find('button').eq(1).button('disable');//提交过程中提交按钮禁用
				},
				//验证通过后的动作，可以跟函数
				success:function(responseText,statusText){
					if(responseText){
						$('#reg').dialog('widget').find('button').eq(1).button('enable'); //提交按钮恢复
						$('#loading').dialog().html('数据提交成功！');		//弹出提示框并且修改，
						$.cookie('user',$('#user').val());		//cookie('name','value')，存在计算机的数据，账号信息
						setTimeout(function(){
							$('#loading').dialog('close');   //提示框关闭
							$('#reg').dialog('close');		//注册对话框关闭
							$('#reg').resetForm();			//重置表单
							$('#reg span.star').html('*');
							$('#loading').dialog().html('数据交互中...');  //还原提示框
							$('#member,#logout').show();			//用户，退出显示
							$('#reg_a,#login_a').hide();			//注册，登录隐藏
							$('#member').html($.cookie('user'));	//用户修改为账户名，到此处用户注册登录成功
						},1000);
					}
				},
			});
		},

		//注册错误信息提示
		showErrors:function(errorMap,errorList){  			//显示未通过的元素
			var error=this.numberOfInvalids();      		//未通过个数
			if (error>0) {
				$('#reg').dialog('option','height',error*20+340);  //根据未通过元素个数来调整对话框高度
			}else{
				$('#reg').dialog('option','height',340);
			}
			this.defaultShowErrors();
		},


		//未通过验证的元素改变样式
		highlight:function(element,errorClass){
			$(element).css('border','1px solid #639');
			$(element).parent().find('span').html('*');  //遍历到父元素，然后找到span子元素
		},
		//通过验证的元素改变样式
		unhighlight:function(element,errorClass){
			$(element).css('border','1px solid #ccc');
			$(element).parent().find('span').html('ok');
		},


		//注册错误提示信息以及规则
		errorLabelContainer:'ol.reg_error',  //errorLabelContainer Selector 把错误信息统一放在一个容器里面
		wrapper:'li',			//wrapper String 使用什么标签再把上边的errorELement包起来
		rules:{					//自定义验证规则 键值对的形式，后面可以是对象
			user:{
				required:true,		//必填
				minlength:2,		//最小2位
				remote:{					//使用ajax方式进行验证，远程地址只能输出true或者false
					url:'php/is_user.php',  //提交当前验证的值到远程地址，如果需要提交其他的值，可以使用data选项
					type:'POST',			//发送方式
				},
			},
			pass:{
				required:true,
				minlength:6,
			},
			email:{
				required:true,
				email:true,					//开启邮箱验证
			},
		},
		messages:{							//错误提示信息
			user:{
				required:'账户不得为空',
				minlength:'账号不得小于2位',
				remote:'账号被占用',
			},
			pass:{
				required:'密码不得为空',
				minlength:'密码不得小于6位',
			},
			email:{
				required:'请输入正确的邮箱',
			},
		},
	});


	//日历属性及外观设置
	$('#birthday').datepicker({
		//日历属性
		dateFormat:'mm-dd-yy',     //格式
		dayNamesMin:['日','一','二','三','四','五','六'],    //星期
		monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		monthNamesShort : ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
		showWeek:true,
		weekHeader:'周',
		firstDay:1,     //第一天设为星期一
		//外观
		numberOfMonths:1,    //显示一个月
		changeMonth:true,	 //月选择器
		changeYear:true,	 //年选择器
		showButtonPanel:true, //显示按钮面板
		closeText:'关闭',		//按钮文字
		currentText:'今天',
		maxDate:0,//当天之后不可选
		//minDate:-10,当前10天
		yearRange:'1999:2016',//限制年限
	});


	//邮箱验证及提示
	$('#email').autocomplete({ 			//根据用户输入值进行搜索和过滤，让用户快速找到并从预设值列表中选择
		delay:0,   //延迟时间
		autoFocus:true,    //自动聚焦
		source:function(request,reponse){
			var hosts=['qq.com','163.com','gmail.com'],
				term=request.term,  //获取用户输入内容
				name=term,			//邮箱用户名
				host='',			//邮箱域名
				ix=term.indexOf('@'),//@的位置
				result=[];			//最终邮箱列表'
				result.push(term);
			//有@的时候重新分配用户名和域名
			if (ix>-1) {
				name=term.slice(0, ix);
				host=term.slice(ix + 1);
			}
			if (name) {
				/*
				如果已经输入@和后面的域名，那么找到相关的域名提示
				比如已经输入bbb@1  则提示bbb@163.com
				如没有，则提示所有域名
				*/
				var findedHosts = (host ? $.grep(hosts, function (value, index) {      //？？？？？？？？？？？
					return value.indexOf(host) > -1
				}) : hosts),
				findedResult = $.map(findedHosts, function (value, index) {
					return name + '@' + value;
				});
				result = result.concat(findedResult);
			};
			reponse(result);   //展示补全结果
		},
	});


	//登录及验证
	$('#login_a').click(function () {
		$('#login').dialog('open');
	});

	$('#login').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		width : 320,
		height : 240,
		buttons : {
			'登录' : function () {
				$(this).submit();
			}
		}
	}).validate({
		submitHandler : function (form) {
			$(form).ajaxSubmit({
				url : 'php/login.php',
				type : 'POST',
				beforeSubmit : function (formData, jqForm, options) {
					$('#loading').dialog('open');
					$('#login').dialog('widget').find('button').eq(1).button('disable');
				},
				success : function (responseText, statusText) {
					if (responseText) {
						$('#login').dialog('widget').find('button').eq(1).button('enable');
						$('#loading').html('登录成功！');
						//cookie周期,可以理解为保持登录的时间，如果周期设置的很短，登录后马上就会退出，不等于记住密码！！！
						if ($('#expires').is(':checked')) {
							$.cookie('user', $('#login_user').val(), {
								expires :7,
							});
						} else {
							$.cookie('user', $('#login_user').val());
						}
						setTimeout(function () {
							$('#loading').dialog('close');
							$('#login').dialog('close');
							$('#login').resetForm();
							$('#login span.star').html('*');
							$('#loading').html('数据交互中...');
							$('#member, #logout').show();
							$('#reg_a, #login_a').hide();
							$('#member').html($.cookie('user'));   //用户修改为用户名
						}, 1000);
					}
				},
			});
		},
		showErrors : function (errorMap, errorList) {
			var errors = this.numberOfInvalids();
			if (errors > 0) {
				$('#login').dialog('option', 'height', errors * 20 + 240);
			} else {
				$('#login').dialog('option', 'height', 240);
			}
			this.defaultShowErrors();
		},
		highlight : function (element, errorClass) {
			$(element).css('border', '1px solid #630');
			$(element).parent().find('span').html('*');
		},
		unhighlight : function (element, errorClass) {
			$(element).css('border', '1px solid #ccc');
			$(element).parent().find('span').html('&nbsp;');
		},
		errorLabelContainer : 'ol.login_error',
		wrapper : 'li',
		rules : {
			login_user : {
				required : true,
				minlength : 2,
			},
			login_pass : {
				required : true,
				minlength : 6,
				remote : {
					url : 'php/login.php',
					type : 'POST',
					data : {     					//要传递的数据
						login_user : function () {
							return $('#login_user').val();
						},
					},
				},
			},
		},
		messages : {
			login_user : {
				required : '帐号不得为空！',
				minlength : '帐号不得小于2位',
			},
			login_pass : {
				required : '密码不得为空！',
				minlength : '密码不得小于6位！',
				remote : '帐号或密码不正确！',
			}
		}
	});

	//左侧选项卡
	$('#tabs').tabs({
		collapsible:true,//选项卡可以折叠
		disabled:[3],//禁用
		active:0,//默认打开哪个选项卡
		heightStyle:'content',//高度设置，auto根据最高的设置，也可以写死
	});
	//右侧折叠菜单
	$('#accordion').accordion({
		collapsible:true,
		active:false,
		header:'h3',
	});



	$.ajax({
		url:'php/show_content.php',
		type:'POST',
		success:function(response,status,xhr){
			var json= $.parseJSON(response);
			var html='';
			var arr=[];
			var summary=[];
			$.each(json,function(index,value){
				html += '<h4>' + value.user + ' 发表于 ' + value.date + '</h4><h3>' + value.title + '</h3><div class="editor">' + value.content + '</div><div class="bottom"><span class="comment" data-id="'+value.id+'">'+value.count+'条评论 </span><span class="up">收起</span></div><hr noshade="noshade" size="1";/><div class="comment_list"></div>';
			});
			$('.content').append(html);

			$.each($('.editor'),function(index,value){
				arr[index]=$(value).html();
				summary[index]=arr[index].substr(0,200);
				if (summary[index].substr(199,200)=='<' ){
					summary[index]=replacePos(summary[index],200,'');
				}
				if (summary[index].substr(199,200)=='</') {
					summary[index]=replacePos(summary[index],200,'');
					summary[index]=replacePos(summary[index],199,'');
				}
				if (arr[index].length>200) {
					summary[index]+='。。。<span class="down">显示全部</span>';
					$(value).html(summary[index]);
					$('.bottom .up').hide();
				}
			});

			$.each($('.editor '),function(index,value){
				$(this).on('click','.down',function(){
					$('.editor').eq(index).html(arr[index]);
					$(this).hide();
					$('.bottom .up').eq(index).show();
				});
			});

			$.each($('.bottom '),function(index,value){
				$(this).on('click','.up',function(){
					$('.editor').eq(index).html(summary[index]);
					$(this).hide();
					$('.editor .down').eq(index).show();
				});
			});

			$.each($('.bottom '),function(index,value){
				$(this).on('click','.comment',function(){
					var comment_this=this;
					if ($.cookie('user')){
						if (!$('.comment_list').eq(index).has('form').length) {
							$.ajax({
								url:'php/show_comment.php',
								type:'POST',
								data:{
									titleid:$(comment_this).attr('data-id'),
								},
								beforeSend:function(jqXHR,setting){
									$('.comment_list').eq(index).append('<dl class="comment_load" ><dd>正在加载评论</dd></dl>');
								},
								success:function(response,status){
									$('.comment_list').eq(index).find('.comment_load').hide();
									var json_comment= $.parseJSON(response);
									$.each(json_comment,function(index2,value){
										$('.comment_list').eq(index).append('<dl clas="comment_content " style="border-bottom:1px solid #ccc;"><dt>'+value.user+'</dt><dd>'+value.comment+'</dd><dd clas="date">'+value.date+'</dd></dl>');
									});

									$('.comment_list').eq(index).append('<form><dl class="comment_add"><dt><textarea name="comment"></textarea></dt><dd><input type="hidden" name="titleid" value="'+$(comment_this).attr('data-id')+'"/><input type="hidden" name="user" value="'+$.cookie('user')+'"/><input type="button" value="发表"/></dd></dl></form>');
									$('.comment_list').eq(index).find('input[type=button]').button().click(function(){
										var _this = this;
										$('.comment_list').eq(index).find('form').ajaxSubmit({
											url : 'php/add_comment.php',
											type : 'POST',
											beforeSubmit : function (formData, jqForm, options) {
												$('#loading').dialog('open');
												$(_this).button('disable');
											},
											success : function (responseText, statusText) {
												if (responseText) {
													$(_this).button('enable');
													$('#loading').html('数据新增成功...');
													setTimeout(function () {
														$('#loading').dialog('close');
														var date = new Date();
														$('.comment_list').eq(index).prepend('<dl class="comment_content"><dt>' + $.cookie('user')
															+ '</dt><dd>' + $('.comment_list').eq(index).find('textarea').val() + '</dd><dd>' +
															date.getFullYear() + '-' + (date.getMonth()+ 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' +
															date.getMinutes() + ':' + date.getSeconds() + '</dd></dl>');
														$('.comment_list').eq(index).find('form').resetForm();
														$('#loading').html('数据交互中...');
													}, 1000);
												}
											},
										});
									});
								}
							});
						}
						if ($('.comment_list').eq(index).is(':hidden') ){
							$('.comment_list').eq(index).show();
						}else{
							$('.comment_list').eq(index).hide();
						}

					}else{
						$('#error').dialog('open');
						setTimeout(function(){
							$('#error').dialog('close');
							$('#login').dialog('open');
						},1000);
					}
				});

			});

			function replacePos(strObj,pos,replaceText){
				return strObj.substr(0,pos-1)+replaceText+strObj.subString(pos,strObj.length);
			};
		},
	});

	//提问对话框
	$('#question').dialog({
		autoOpen:false,
		modal:true,
		width:500,
		height:360,
		resizable:false,
		buttons:{
			'发布':function(){
				$(this).ajaxSubmit({
					url:'php/add_content.php',
					type:'POST',
					data:{
						user:$.cookie('user'),
						content:$('.uEditorIframe').contents().find('#iframeBody').html(),
					},
					beforeSubmit:function(formData,jqForm,options){
						$('#loading').dialog('open');
						$('#question').dialog('widget').find('button').eq(1).button('disable');
					},
					success:function(responseText,statusText){
						if(responseText){
							$('#question').dialog('widget').find('button').eq(1).button('enable');
							$('#loading').dialog().html('数据提交成功！');
							setTimeout(function(){
								$('#loading').dialog('close');
								$('#question').dialog('close');
								$('#question').resetForm();
								$('#question span.star').html('*');
								$('.uEditorIframe').contents().find('#iframeBody').html('请输入问题描述...')
								$('#loading').dialog().html('数据交互中...');
							},1000);

						}
					},
				});
			},
			'取消':function(){
				$(this).dialog('close');
			}
		},
	});


	$('.uEditorCustom').uEditor();
	$('#error').dialog({
		autoOpen:false,
		modal:true,
		claseOnEscape:false,
		resizable:false,
		draggable:false,
		width:180,
		height:60,
	}).parent().find('.ui-widget-header').hide();

	$('#member,#logout').hide();
	if ($.cookie('user')) {
		$('#member,#logout').show();
		$('#reg_a,#login_a').hide();
		$('#member').html($.cookie('user'));
	}else{
		$('#member,#logout').hide();
		$('#reg_a,#login_a').show();
	}

	$('#logout').click(function(){
		$.removeCookie('user');
		window.location.href='/jQuery/8.0';
	});
	//加载框
	$('#loading').dialog({
		autoOpen:false,
		modal:true,
		claseOnEscape:false,
		resizable:false,
		draggable:false,
		width:180,
		height:60,
	}).parent().find('.ui-widget-header').hide();
});
