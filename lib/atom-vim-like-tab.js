'use babel'

import TabController from './tab_controller'
import { CompositeDisposable } from 'atom'

export default {
  tabControllers: [],
  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable()

    const initPanes = atom.workspace.getPanes()
    this.tabControllers.push(new TabController(initPanes))

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-vim-like-tab:hide': () => this.hide(),
      'atom-vim-like-tab:show': () => this.show(),
      'atom-vim-like-tab:new-tab': () => this.createNewTab(),
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
    this.tabControllers.forEach((tabContoller) => { tabContoller.destroy() })
  },

  hide(index = 0) {
    this.tabControllers[index].hide()
  },
  show(index = 0) {
    this.tabControllers[index].show()
  },
  createNewTab() {
    this.tabControllers.forEach((tabContoller) => {
      tabContoller.hide()
    })

    const tabContoller = new TabController
    const activePane = atom.workspace.getActivePane()
    activePane.splitRight()

    this.tabControllers.push(tabContoller)
    console.log(this.tabControllers)
  },

}
