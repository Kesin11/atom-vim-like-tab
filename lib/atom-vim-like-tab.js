'use babel'

import TabController from './tab_controller'
import { CompositeDisposable } from 'atom'

export default {
  tabControllers: [],
  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable()

    this.tabControllers.push(new TabController)

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-vim-like-tab:hide': () => this.hide(),
      'atom-vim-like-tab:show': () => this.show(),
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
    this.tabControllers.forEach((tabContoller) => { tabContoller.destroy() })
  },

  hide() {
    this.tabControllers[0].hide()
  },
  show() {
    this.tabControllers[0].show()
  },

}
