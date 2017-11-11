'use babel'

import TabController from './tab_controller'
import TabControllerCollection from './tab_controller_collection'
import TabListView from './tab_list_view'
import TabPanelView from './tab_panel_view'
import { CompositeDisposable } from 'atom'

export default class AtomVimLikeTab {
  constructor () {
    this.tabControllerCollection = null
    this.tabListView = null
    this.tabPanelView =  null
    this.subscriptions =  null
    this.showIndex =  0
  }

  async activate() {
    this.subscriptions = new CompositeDisposable()
    this.tabControllerCollection = new TabControllerCollection()

    this.tabPanelView = new TabPanelView(this.tabControllerCollection)
    this.tabPanel = atom.workspace.addTopPanel({ item: this.tabPanelView.element })

    const initPanes = atom.workspace.getCenter().getPanes()
    this.tabControllerCollection.add(new TabController(initPanes))

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-vim-like-tab:new': () => this.createNewTab(),
      'atom-vim-like-tab:close': () => this.closeTab(),
      'atom-vim-like-tab:next': () => this.showNextTab(),
      'atom-vim-like-tab:previous': () => this.showPreviousTab(),
      'atom-vim-like-tab:list': () => this.createTabListView().show(),
    }))

    this.tabControllerCollection.onDidPanesEmpty(() => this.showPreviousTab())
  }

  async deactivate() {
    let promise = Promise.resolve()
    if (atom.config.get('atom-vim-like-tab.dontRestoreInactiveTabsPane')) {
      this.closeInactiveTabs()
      // NOTE: saveState() is not public API. Maybe not working newer atom version.
      atom.saveState()

      // hack for waiting async pane.close() and atom.saveState()
      promise = new Promise((resolve) => setTimeout(resolve, 1000))
    }

    this.subscriptions.dispose()
    this.tabControllerCollection.destroy()
    this.tabListView = null

    return promise
  }

  tabControllers() {
    return this.tabControllerCollection.tabControllers
  }

  createNewTab() {
    // hide current tab
    this.tabControllers().forEach((tabController) => tabController.hide())

    // create new pane for new tab and change active pane
    const tabController = new TabController
    const activePane = atom.workspace.getCenter().getActivePane()
    activePane.splitRight()

    this.tabControllerCollection.add(tabController)
    this.showIndex = this.tabControllerCollection.length - 1
  }

  closeTab() {
    const closingTabController = this.tabControllers().find(tabController =>
      tabController.isActive === true
    )
    closingTabController.closeAllPanes()
  }

  closeInactiveTabs() {
    this.tabControllers()
      .filter(tabController => !tabController.isActive)
      .forEach(tabController => tabController.closeAllPanes())
  }

  showTabByIndex(index) {
    this.showIndex = this.getValidShowIndex(index)
    this.tabControllers().forEach((tabController, i) => {
      if (i !== this.showIndex) tabController.hide()
    })
    this.tabControllers()[this.showIndex].show()
  }

  showNextTab() {
    this.showTabByIndex(this.showIndex + 1)
  }

  showPreviousTab() {
    this.showTabByIndex(this.showIndex - 1)
  }

  getValidShowIndex(index) {
    if (index >= this.tabControllerCollection.length) {
      return 0
    } else if (index < 0) {
      return this.tabControllerCollection.length - 1
    }

    return index
  }

  createTabListView() {
    if (this.tabListView === null) {
      this.tabListView = new TabListView(this.tabControllers())
      // when tabListView confirmed show selected tab
      this.tabListView.onDidTabListConfirmed((index) => {
        this.showTabByIndex(index)
      })
    }
    return this.tabListView
  }
}
