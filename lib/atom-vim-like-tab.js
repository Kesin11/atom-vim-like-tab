'use babel'

import TabController from './tab_controller'
import { CompositeDisposable } from 'atom'
import _ from 'underscore-plus'

export default {
  tabControllers: [],
  subscriptions: null,
  showIndex: 0,

  activate() {
    this.subscriptions = new CompositeDisposable()

    const initPanes = atom.workspace.getPanes()
    this.pushTabController(new TabController(initPanes))

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-vim-like-tab:hide': () => this.hide(),
      'atom-vim-like-tab:show': () => this.show(),
      'atom-vim-like-tab:new-tab': () => this.createNewTab(),
      'atom-vim-like-tab:next': () => this.showNextTab(),
      'atom-vim-like-tab:previous': () => this.showPreviousTab(),
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
    this.tabControllers.forEach((tabContoller) => { tabContoller.destroy() })
    this.tabControllers = []
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

    this.pushTabController(tabContoller)
    this.showIndex = this.tabControllers.length - 1
  },
  showTabByIndex(index) {
    this.showIndex = this.getValidShowIndex(index)
    _.each(this.tabControllers, (tabController, i) => {
      if (i !== this.showIndex) tabController.hide()
    })
    this.tabControllers[this.showIndex].show()
  },
  showNextTab() {
    this.showTabByIndex(this.showIndex + 1)
  },
  showPreviousTab() {
    this.showTabByIndex(this.showIndex - 1)
  },
  getValidShowIndex(index) {
    if (index >= this.tabControllers.length) {
      return 0
    } else if (index < 0) {
      return this.tabControllers.length
    }

    return index
  },
  pushTabController(tabController) {
    this.tabControllers.push(tabController)
    tabController.onDidPanesEmpty((_tabController) => {
      _tabController.destroy()
      _.remove(this.tabControllers, _tabController)
      this.showPreviousTab()
    })
  },
}
