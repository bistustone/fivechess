var flag=true;//黑棋
var gameover=false;//还没有结束
// var chessBoard=new Array();
var chessBoard=[];//生成一维数组

var myWin=[];//我方赢法的统计数组
var computerWin=[];//计算机方的赢法统计数组

for(var i=0;i<15;i++){
//	chessBoard[i]=new Array();
	chessBoard[i]=[];//在一维数组中生成二维
	for(var j=0;j<15;j++){
		chessBoard[i][j]=0;//初始化
	}
}
var wins=[];//生成赢法数组
for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
	}
}
var count=0;//统计赢法的数量
//横向五子棋赢法
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		//得到第一个子
		//然后五子相连
		for(var k=0;k<5;k++){
			wins[i][j+k][count]=true;
		}
		count++;
	}
}
//纵向五子棋赢法
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		//得到第一个子
		//然后五子相连
		for(var k=0;k<5;k++){
			wins[j+k][i][count]=true;
		}
		count++;
	}
}
//斜方向五子棋赢法
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		//得到第一个子
		//然后五子相连
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}
//反斜方向五子棋赢法
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		//得到第一个子
		//然后五子相连
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}
console.log(count);

for(var i=0;i<count;i++){
	myWin[i]=0;
	computerWin[i]=0;
}

var chess=document.getElementById('chess');
var context=chess.getContext('2d');//获取画布上的2d环境
context.strokeStyle='#BFBFBF';//设置或返回用于笔触的颜色

drawChessBoard();
//oneStep(0,0,true);//true为黑棋
//oneStep(1,1,false);//false为白棋

function drawChessBoard(){
	for(var i=0;i<15;i++){
		context.moveTo(15+30*i,15);
		context.lineTo(15+30*i,435);
		context.stroke();//画线
		context.moveTo(15,15+30*i);
		context.lineTo(435,15+30*i);
		context.stroke();
	}
}

function oneStep(i,j,flag){
	context.beginPath();//起始一条路径
	context.arc(15+30*i,15+30*j,13,0,2*Math.PI);//圆心（200,200）半径100 0~360度
	context.closePath();//创建从当前点回到起始点的路径
	var gradient=context.createRadialGradient(15+30*i+2,15+30*j-2,13,15+30*i+2,15+30*j-2,0);//前后两个同心圆的渐变
	if(flag){//黑棋
		gradient.addColorStop(0,"#0A0A0A");
		gradient.addColorStop(1,'#636766');
	}else{//白棋
		gradient.addColorStop(0,"#D1D1D1");
		gradient.addColorStop(1,'#F9F9F9');
	}
	
	context.fillStyle=gradient;
	context.fill();//填充图形
}

chess.onclick=function(e){
	if(gameover){
		return;
	}
	if(!flag){
		return;
	}
	var x=e.offsetX;
	var y=e.offsetY;
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBoard[i][j]==0){
		oneStep(i,j,flag);
		chessBoard[i][j]=1;
		
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;

				computerWin[k]=6;
				if(myWin[k]==5){
					window.alert("YOU WIN");
					gameover=true;
				}
			}
		}
		if(!gameover){
			flag=!flag;
			computerAI();			
		}
	}
	
}

//电脑的执行算法
function computerAI(){
	var myScore=[];//我的得分
	var computerScore=[];//计算机得分
	var u=0,v=0;//存储最高分的位置点
	var max=0;//存储最高分
	for(var i=0;i<15;i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0;j<15;j++){
			myScore[i][j]=0;
			computerScore[i][j]=0;
		}
	}
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBoard[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j]+=200;
						}else if(myWin[k]==2){
							myScore[i][j]+=400;
						}else if(myWin[k]==3){
							myScore[i][j]+=2000;
						}else if(myWin[k]==4){
							myScore[i][j]+=10000;
						}
						if(computerWin[k]==1){
							computerScore[i][j]+=220;
						}else if(computerWin[k]==2){
							computerScore[i][j]+=420;
						}else if(computerWin[k]==3){
							computerScore[i][j]+=2200;
						}else if(computerWin[k]==4){
							computerScore[i][j]+=22000;
						}
					}
				}
				if(myScore[i][j]>max){
					max=myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					if(computerScore[i][j]>computerScore[u][v]){
						u=i;
						v=j;
					}
				}
				if(computerScore[i][j]>max){
					max=computerScore[i][j];
					u=i;
					v=j;
				}else if(computerScore[i][j]==max){
					if(myScore[i][j]>myScore[u][v]){
						u=i;
						v=j;
					}
				}
			}
		}
	}//得到此时得分最高的点(u,v)
	oneStep(u,v,false);
	chessBoard[u][v]=2;

	for(var k=0;k<count;k++){
		if(wins[u][v][k]){
			computerWin[k]++;

			myWin[k]=6;
			if(computerWin[k]==5){
				window.alert("CPMPUTER WIN");
				gameover=true;
			}
		}
	}
	if(!gameover){
		flag=!flag;			
	}
}
