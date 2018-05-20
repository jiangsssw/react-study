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
    render:function(){
      var styleObj = {
      };
      if(this.props.arrange.pos){
        styleObj = this.props.arrange.pos;
      }
      return (
        <figure className='img-figure' style={styleObj}>
          <img src={this.props.data.imageURL}
          alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
          </figcaption>
        </figure>
      );
    }
})
//获取区间的一个随机值
function getRangeRandom(low,height){
  return Math.floor(Math.random() * (height - low)+low)
}

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
    //居中centerIndex的图片信息
  imgsArrangeCenterArr[0].pos = centerPos;

  //取出要布局上册的图片状态信息
  topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length
  - topImgNum));
  imgsArrangeArrTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

  //布局位于上册的图片
  imgsArrangeArrTopArr.forEach(function(value,index){
    imgsArrangeArrTopArr[index].pos = {
      top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
      left : getRangeRandom(vPosRangeX[0],vPosRangeX[1])
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

    imgsArrangeArr[i].pos={
      top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
      left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
    }
  }
  if(imgsArrangeArrTopArr && imgsArrangeArrTopArr[0]){
    imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeArrTopArr[0]);
  }
  imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

  this.setState({
    imgsArrangeArr : imgsArrangeArr
  });
  },
  
  getInitialState : function(){
    return {
      imgsArrangeArr:[]
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
            }
          }
        }
        imgFigures.push(<ImgFigure data={value} ref={'imgFigures'+index}
        arrange = {this.state.imgsArrangeArr[index]}/>)
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
