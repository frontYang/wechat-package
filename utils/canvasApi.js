/* canvas通用方法 */

/* 圆角矩形 */
const drawRoundRect = (opts)  =>  {
  let { ctx, x, y, w, h, r, fillStyle } = opts
  // 开始绘制
  ctx.beginPath()
  ctx.save()
  // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
  // 这里是使用 fill 还是 stroke都可以，二选一即可    
  ctx.fillStyle = 'transparent'
  // ctx.setStrokeStyle('transparent')
  // 左上角
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

  // border-top
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.lineTo(x + w, y + r)
  // 右上角
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

  // border-right
  ctx.lineTo(x + w, y + h - r)
  ctx.lineTo(x + w - r, y + h)
  // 右下角
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

  // border-bottom
  ctx.lineTo(x + r, y + h)
  ctx.lineTo(x, y + h - r)
  // 左下角
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

  // border-left
  ctx.lineTo(x, y + r)
  ctx.lineTo(x + r, y)
  ctx.fillStyle = fillStyle || '#ffdb49';

  // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
  ctx.fill()    
  ctx.clip()
  ctx.restore()
  
  ctx.closePath()
}

/**
 * 竖排文字
 * @param {object} opts 
 */ 
const drawWrapText = (opts) => {
  let { ctx, text, x, y, maxWidth, lineHeight } = opts
  if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
      return;
  }
  
  let canvas = ctx.canvas;
  
  if (typeof maxWidth == 'undefined') {
      maxWidth = (canvas && canvas.width) || 300;
  }
  if (typeof lineHeight == 'undefined') {
      lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
  }
  
  // 字符分隔为数组
  let arrText = text.split('');
  let line = '';
  
  for (let n = 0; n < arrText.length; n++) {
      let testLine = line + arrText[n];
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = arrText[n];
          y += lineHeight;
      } else {
          line = testLine;
      }
  }
  ctx.fillText(line, x, y);
}

/* 环形 */
const drawRound = (opts) => {
  let { ctx, X, Y, R, strokeStyle, lineWidth, per, start } = opts
  let round = 0

  if(start && per){
    round = start + per * Math.PI * 2 
  }else {
    start = 0
    round = Math.PI * 2
  }

  ctx.beginPath()
  ctx.arc(X, Y, R, start, round, false)
  ctx.setLineWidth(lineWidth || 5)
  ctx.setStrokeStyle(strokeStyle || '#ffdb49')
  ctx.stroke()
  ctx.restore()
  ctx.closePath()
}

/* 裁剪圆形图片 */
const drawCircleImg = (opts) => {
  let { ctx, img, x, y, r, d } = opts

  let cx = x + r
  let cy = y + r

  ctx.beginPath()
  ctx.save() 
  ctx.arc(cx, cy, r, 0, 2 * Math.PI)   
  ctx.fill()
  ctx.clip()    
  ctx.drawImage(img, cx - r, cy - r, d, d)
  ctx.restore()
  ctx.closePath()
}

/* 获取适配 */
const getRpx = () => {
  return new Promise(resolve => {
    wx.getSystemInfo({
      success: (res) => {
        let rpx = res.windowWidth / 750
        resolve(rpx)
      }
    })
  })
}

/* promise */
const imgPromise = (img) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: img,
      success: (res) => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  }).catch(res => {
    
  })
}

module.exports = {  
  drawWrapText,
  drawRoundRect,
  drawRound,
  drawRoundRect,
  drawCircleImg,
  getRpx,
  imgPromise,
}