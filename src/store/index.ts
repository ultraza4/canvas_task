import { createStore } from 'vuex'
import  {dragBlock}  from '@/store/modules/dragBlock'


export default createStore({
  modules: {
    drag: dragBlock,
  }
})