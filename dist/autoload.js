/*!
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */

const live2d_path = 'https://live2d.ariabennett.org/';

function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;
    if (type === 'css') {
      tag = document.createElement('link');
      tag.rel = 'stylesheet';
      tag.href = url;
    }
    else if (type === 'js') {
      tag = document.createElement('script');
      tag.type = 'module';
      tag.src = url;
    }
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}

// 🔥 移动端检测函数
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth < 768;
}

(async () => {
  // 🔥 移动端优化：不直接return，而是加载移动端配置
  const mobile = isMobile();
  
  // 避免图片跨域问题
  const OriginalImage = window.Image;
  window.Image = function(...args) {
    const img = new OriginalImage(...args);
    img.crossOrigin = "anonymous";
    return img;
  };
  window.Image.prototype = OriginalImage.prototype;

  // 🔥 根据设备加载不同的CSS
  await Promise.all([
    loadExternalResource(live2d_path + (mobile ? 'waifu-mobile.css' : 'waifu.css'), 'css'),
    loadExternalResource(live2d_path + 'waifu-tips.js', 'js')
  ]);

  // 🔥 移动端专用配置
  const mobileConfig = {
    waifuPath: live2d_path + 'waifu-tips.json',
    cdnPath: 'https://cdn.jsdmirror.com/gh/fghrsh/live2d_api/',
    cubism2Path: live2d_path + 'live2d.min.js',
    cubism5Path: live2d_path + 'live2dcubismcore.min.js',
    
    // 移动端：精简工具栏，只保留核心功能
    tools: mobile ? ['switch-model', 'quit'] : ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
    
    logLevel: 'warn',
    
    // 移动端：禁用拖拽，避免误触
    drag: !mobile,
  };

  initWidget(mobileConfig);
})();

console.log(`\n%cLive2D%cWidget%c\n`, 'padding: 8px; background: #cd3e45; font-weight: bold; font-size: large; color: white;', 'padding: 8px; background: #ff5450; font-size: large; color: #eee;', '');
