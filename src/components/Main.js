require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
var imageDatas= require('../data/imageDatas.json');
//利用自执行函数，将图片信息转成路劲信息
imageDatas = (function genImageURL(imageDataArr){
  for(var i = 0,j = imageDataArr.length; i < j;i++){
    var singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/'+ singleImageData.fileName
  );
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);
var ImgFigure = React.createClass({
  //imgFigure点击处理函数
    handleClick : function(e){
      if(this.props.arrange.isCenter){
        this.props.inverse();
      }else{
        this.props.center();
      }
      e.preventDefault();
      e.stopPropagation();
      
    },
    render:function(){
      var styleObj = {
      };
      if(this.props.arrange.pos){
        styleObj = this.props.arrange.pos;
      }
      //如果图片中有rotate的值并且部位0，则添加旋转角度
      if(this.props.arrange.rotate){
        //为样式添加厂商前缀
        (['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
          styleObj[value] = 'rotate(' + this.props.arrange.rotate +'deg)';
        }.bind(this))  ;
      }
      if(this.props.arrange.isCenter){
        styleObj.zIndex = 11
      }
      var imgFigureClassName = 'img-figure';
      if(this.props.arrange.isInverse){
        imgFigureClassName +=' is-inverse'
      }else{
        imgFigureClassName +='';
      }
      return (
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
          <img src={this.props.data.imageURL}
          alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick}><p>
                {this.props.data.desc}
              </p>
            </div>
          </figcaption>
        </figure>
      );
    }
})
//获取区间的一个随机值
function getRangeRandom(low,height){
  return Math.floor(Math.random() * (height - low)+low)
}
//获取一个正负0~30的随机值
function get30DegRandom(){
  return((Math.random() > 0.5? '':'-') + Math.floor(Math.random() * 30));
}
var ControllerUnits = React.createClass({
    handleClickForC : function(e){
      //如果当前图片是居中状态则为其翻转，否则为其居中
      if(this.props.arrange.isCenter){
        this.props.inverse();
      }else{
        this.props.center();
      }
      e.preventDefault();
      e.stopPropagation();
      
    },
    render : function(){
      var ControlClassName = 'controller-unit' ;
      //如果当前图片呢是居中为控制组件添加居中太
      if(this.props.arrange.isCenter){
        ControlClassName += ' is-center';
      //如果当前图片是翻转太则为其添加翻转态
        if(this.props.arrange.isInverse){
          ControlClassName += ' is-inverse';
        }
      }
      return (<span className={ControlClassName} onClick={this.handleClickForC}></span>);
    }
});
var AppComponent = React.createClass({
  Constant :{
    centerPos : {
      left : 0,
      top : 0
    },
    hPosRange : {
      leftSecX : [0,0],
      rightSecX : [0,0],
      y : [0,0]
    },
    vPosRange : {
      x : [0,0],
      topY : [0,0]
    }
  },
  /**
   * 翻转图片
   * @param index 输入当前被执行inverse的图片所对应的index值
   * @return {function} 这是一个闭包函数，其return 一个真正被执行的函数
   */
    inverse : function(index){
      return function(){
        var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse= !imgsArrangeArr[index].isInverse;
            this.setState({
              imgsArrangeArr : imgsArrangeArr
            });
      }.bind(this);
    },
    center : function(index){
      return function(){
        this.rearrange(index);
      }.bind(this);
    },
  //布局所有的图片
  //@param centerIndex 指定居中那个图片
  rearrange : function(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
    Constant = this.Constant,
    centerPos = Constant.centerPos,
    hPosRange = Constant.hPosRange,
    vPosRange = Constant.vPosRange,
    hPosRangeLeftSecX = hPosRange.leftSecX,
    hPosRangeRightSecX = hPosRange.rightSecX,
    hPosRangeY = hPosRange.y,
    vPosRangeTopY = vPosRange.topY,
    vPosRangeX = vPosRange.x,

    imgsArrangeArrTopArr = [],
    topImgNum = Math.floor(Math.random() * 2), //去一个范围为0~1的随机数
    topImgSpliceIndex = 0,
    imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
    //居中centerIndex的图片信息//居中的centerIndex不需要旋转
  imgsArrangeCenterArr[0]={
    pos : centerPos,
    rotate : 0,
    isCenter : true

  }
    
  
  //取出要布局上册的图片状态信息
  topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length
  - topImgNum));
  imgsArrangeArrTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

  //布局位于上册的图片
  imgsArrangeArrTopArr.forEach(function(value,index){
    imgsArrangeArrTopArr[index] = {
      pos:{
      top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
      left : getRangeRandom(vPosRangeX[0],vPosRangeX[1])
      },
      rotate : get30DegRandom(),
      isCenter : false
    }
  });
  //布局左右两侧的图片
  for(var i = 0,j = imgsArrangeArr.length, k = j/2;i < j; i++){
    var hPosRangeLORX = null;
    //前半部份布局左边，后半部分布局右边
    if(i < k){
      hPosRangeLORX = hPosRangeLeftSecX;
    }else{
      hPosRangeLORX = hPosRangeRightSecX;
    }

    imgsArrangeArr[i]={
      pos:{
      top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
      left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
      },
      rotate : get30DegRandom(),
      isCenter : false
    };
  }
  if(imgsArrangeArrTopArr && imgsArrangeArrTopArr[0]){
    imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeArrTopArr[0]);
  }
  imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

  this.setState({
    imgsArrangeArr : imgsArrangeArr
  });
  },
  /**
   * 利用 rearrange函数，居中对应index的图片
   * @param index,需要被居中的图片对应的图片信息数组的index值
   * @return {Function}
   */
  
  getInitialState : function(){
    return {
      imgsArrangeArr:[
        // {
        //   pos:{
        //     left :0,
        //     right : 0
        //   },
        //   rotate : 0,
        //   isInverse : false //表述图片是否翻转
        //   isCenter : false  //图片是否居中
        // }
      ]
    }

  },
  //组件加载以后，为每张图片计算其取值范围
  componentDidMount : function(){
    
    //首先拿到舞台的大小
    var stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageWidth = stageDom.scrollWidth,
        stageHeight = stageDom.scrollHeight,
        halfStageW = Math.floor(stageWidth/2),
        halfStageH = Math.floor(stageHeight/2);

        //拿到一个imageFigure的大小
        var imageDOM = ReactDOM.findDOMNode(this.refs.imgFigures0),
            imgW = imageDOM.scrollWidth,
            imgH = imageDOM.scrollHeight,
            halfImgW = Math.floor(imgW/2),
            halfImgH = Math.floor(imgH/2);

            //计算中心图片的位置点
            this.Constant.centerPos = {
              left : halfStageW - halfImgW,
              top : halfStageH - halfImgH
            },
            //计算左侧，右侧，上册，图片取值范围
            this.Constant.hPosRange.leftSecX[0] = -halfImgW;
            this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW
            * 3;
            this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
            this.Constant.hPosRange.rightSecX[1] = stageWidth
            - halfImgW;
            this.Constant.hPosRange.y[0] = -halfImgH;
            this.Constant.hPosRange.y[1] = stageHeight -halfImgH;

            this.Constant.vPosRange.topY[0] = -halfImgH;
            this.Constant.vPosRange.topY[1] = halfStageH - halfImgH
            * 3;
            this.Constant.vPosRange.x[0] = halfStageW - imgW;
            this.Constant.vPosRange.x[1] = halfStageW;
            this.rearrange(0);
            
  },
 
  render() {
    var controllerUnits = [],
      imgFigures = [];
      
      imageDatas.forEach(function(value,index){
        if(!this.state.imgsArrangeArr[index]){
          this.state.imgsArrangeArr[index] = {
            pos : {
              left : 0,
              top: 0
            },
            rotate:0,
            isInverse : false,
            isCenter : false
          }
        }
        imgFigures.push(<ImgFigure kry={index} data={value} ref={'imgFigures'+index}
        center={this.center(index)}
        arrange = {this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}/>)
        controllerUnits.push(<ControllerUnits kry={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
      }.bind(this));
    return (
    <section className='stage' ref='stage'>
      <section className='img-sec'>
        {imgFigures}
      </section>
      <nav className='controller-nav'>
        {controllerUnits}
      </nav> </section>
    );
  }
});

AppComponent.defaultProps = {
};

module.exports = AppComponent;
