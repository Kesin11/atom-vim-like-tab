'use babel'

import { Emitter } from 'atom'
import { $$, SelectListView } from 'atom-space-pen-views'
import _ from 'underscore-plus'

export default class TabListView extends SelectListView {
  constructor(tabControllers = []) {
    super()
    this.emitter = new Emitter
    this.tabControllers = tabControllers
    this.addClass('atom-vim-like-tab')
    this.panel = atom.workspace.addModalPanel({ item: this })
  }
  viewForItem(item) {
    return $$(function render() {
      this.li({ class: 'two-lines' }, () => {
        this.span({ class: 'primary-line' }, item.primaryTitle)
        _.each(item.secondaryTitles, (title, i) => {
          this.div({ class: 'secondary-line margin-left' }, `${i + 1}: ${title}`)
        })
      })
    })
  }
  getFilterKey() { return 'primaryTitle' }

  show() {
    const items = this.createItems()
    this.setItems(items)
    this.panel.show()
    this.focusFilterEditor()
  }
  confirmed(item) {
    this.emitter.emit('did-tab-list-confirmed', item.index)
  }
  cancelled() {
    this.panel.hide()
  }

  onDidTabListConfirmed(callback) {
    this.emitter.on('did-tab-list-confirmed', callback)
  }
  createItems() {
    return this.tabControllers.map((tabController, i) => {
      const primaryTitle = tabController.panes[0].getActiveItem().getTitle()
      const paneItems = tabController.panes.map((pane) => pane.getItems())
      const secondaryTitles = _.flatten(paneItems).map((item) => item.getTitle())
      return { primaryTitle, secondaryTitles, index: i }
    })
  }
}
