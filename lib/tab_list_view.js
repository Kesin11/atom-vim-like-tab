'use babel'

import { $$, SelectListView } from 'atom-space-pen-views'
import _ from 'underscore-plus'

export default class TabListView extends SelectListView {
  constructor(tabControllers = []) {
    super()
    this.setItems(tabControllers)
    this.addClass('overlay from-top')
    this.panel = atom.workspace.addModalPanel({ item: this })
  }
  viewForItem(tabController) {
    const primaryTitle = tabController.panes[0].getActiveItem().getTitle()
    const paneItems = tabController.panes.map((pane) => pane.getItems())
    const secondaryTitles = _.flatten(paneItems).map((item) => item.getTitle())
    return $$(function render() {
      this.div({ class: 'atom-vim-like-tab-list' }, () => {
        this.li({ class: 'two-lines' }, () => {
          this.span({ class: 'primary-line' }, primaryTitle)
          _.each(secondaryTitles, (title, i) => {
            this.div({ class: 'secondary-line margin-left' }, `${i + 1}: ${title}`)
          })
        })
      })
    })
  }

  show() {
    this.panel.show()
    this.focusFilterEditor()
  }
  confirmed(tabContoller) {
    console.log(`${tabContoller} was selected`)
    // 選択されたtabContollerをfindしてindexが分かれば楽勝そう
  }
  cancelled() {
    console.log('This view was cancelled')
    this.panel.hide()
  }
}
