'use babel'

import TabController from './tab_controller'
import { CompositeDisposable } from 'atom'
import _ from 'underscore-plus'

export default {
  tabControllers: [],
  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(
      atom.workspace.observePanes((pane) => {
        console.log('add pane', pane)
        const tabController = new TabController(pane)
        this.tabControllers.push(tabController)
        console.log(this.tabControllers)

        this.subscriptions.add(
          pane.onDidDestroy(() => {
            _.remove(this.tabControllers, tabController)
          })
        )
      })
    )
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-vim-like-tab:toggle': () => this.toggle(),
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
    this.tabControllers.forEach((tabContoller) => { tabContoller.destroy() })
  },

  toggle() {
    console.log('AtomVimLikeTab was toggled!')
  },

}
