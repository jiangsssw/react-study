require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
var imageDatas= require('../data/imageDatas.json');
//利用自执行函数，将图片信息转成路劲信息
(function genImageURL(imageDataArr){
  for(var i = 0,j = imageDataArr.length; i < j;i++){
    var singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/'+ singleImageData.fileName
  );
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);



class AppComponent extends React.Component {
  render() {
    return (
    <section className='stage'>
      <section className='img-sec'>
      this is stage!
      </section>
      <nav className='controller-nav'>
      </nav> </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
