'use babel'

import TabController from './tab_controller'
import TabListView from './tab_list_view'
import { CompositeDisposable } from 'atom'
import _ from 'underscore-plus'

export default {
  tabControllers: [],
  tabListView: null,
  subscriptions: null,
  showIndex: 0,

  activate() {
    this.subscriptions = new CompositeDisposable()

    const initPanes = atom.workspace.getPanes()
    this.pushTabController(new TabController(initPanes))

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-vim-like-tab:new': () => this.createNewTab(),
      'atom-vim-like-tab:close': () => this.closeTab(),
      'atom-vim-like-tab:next': () => this.showNextTab(),
      'atom-vim-like-tab:previous': () => this.showPreviousTab(),
      'atom-vim-like-tab:list': () => this.createTabListView().show(),
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
    this.tabControllers.forEach((tabContoller) => { tabContoller.destroy() })
    this.tabControllers = []
    this.tabListView = null
  },

  createNewTab() {
    // hide current tab
    this.tabControllers.forEach((tabContoller) => tabContoller.hide())

    // create new pane for new tab and change active pane
    const tabContoller = new TabController
    const activePane = atom.workspace.getActivePane()
    activePane.splitRight()

    this.pushTabController(tabContoller)
    this.showIndex = this.tabControllers.length - 1
  },

  closeTab() {
    const closingTabController = _.find(this.tabControllers, (_tabController) =>
      _tabController.isActive === true
    )
    closingTabController.closeAllPanes()
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
      return this.tabControllers.length - 1
    }

    return index
  },

  pushTabController(tabController) {
    this.tabControllers.push(tabController)

    tabController.onDidPanesEmpty((_tabController) => {
      _tabController.destroy()
      _.remove(this.tabControllers, _tabController)
      if (this.tabControllers.length > 0) this.showPreviousTab()
    })
  },

  createTabListView() {
    if (this.tabListView === null) {
      console.log(this.tabListView)
      this.tabListView = new TabListView(this.tabControllers)
      // when tabListView confirmed show selected tab
      this.tabListView.onDidTabListConfirmed((index) => {
        this.showTabByIndex(index)
      })
    }
    return this.tabListView
  },
}
