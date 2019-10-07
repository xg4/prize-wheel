import React from 'react'
import Turntable from '../../src/index'

const App: React.FC = () => {
  const t = new Turntable({
    el: '#tt',
    list: [
      {
        text: '一等奖',
        image:
          'https://shark2.douyucdn.cn/front-publish/live-master/assets/images/final_match_logo_77aac23.webp'
      },
      {
        text: '二等奖',
        image:
          'https://shark2.douyucdn.cn/front-publish/live-master/assets/images/final_match_logo_77aac23.webp'
      },
      {
        text: '三等奖',
        image:
          'https://shark2.douyucdn.cn/front-publish/live-master/assets/images/final_match_logo_77aac23.webp'
      },
      {
        text: '四等奖',
        image:
          'https://shark2.douyucdn.cn/front-publish/live-master/assets/images/final_match_logo_77aac23.webp'
      },
      {
        text: '谢谢惠顾',
        image:
          'https://shark2.douyucdn.cn/front-publish/live-master/assets/images/final_match_logo_77aac23.webp'
      }
    ]
  })
  return (
    <div>
      <canvas id="tt"></canvas>

      <button
        onClick={() => {
          // t.start(1)
          t.random()
        }}
      >
        开始
      </button>
    </div>
  )
}

export default App
