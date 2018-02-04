'use babel'

import { Emitter } from 'atom'
import SelectListView from 'atom-select-list'
import _ from 'underscore-plus'

export default class TabListView {
  constructor(tabControllers = []) {
    this.emitter = new Emitter
    this.tabControllers = tabControllers
    this.panel = null
    this.selectListView = new SelectListView({
      items: [],
      filterKeyForItem: (item) => item.primaryTitle,
      didConfirmSelection: (item) => {
        this.selectListView.reset()
        this.emitter.emit('did-tab-list-confirmed', item.index)
      },
      didCancelSelection: () => {
        this.selectListView.reset()
        this.panel.hide()
      },
      elementForItem: ({ primaryTitle, secondaryTitles }) => {
        const li = document.createElement('li')
        li.classList.add('two-lines')

        const span = document.createElement('span')
        span.textContent = primaryTitle
        span.classList.add('primary-line')
        li.appendChild(span)

        secondaryTitles.forEach((title, i) => {
          const div = document.createElement('div')
          div.textContent = `${i + 1}: ${title}`
          div.classList.add('secondary-line', 'margin-left')
          span.appendChild(div)
        })
        return li
      },
    })
    this.selectListView.element.classList.add('atom-vim-like-tab')
  }
  show() {
    this.selectListView.update({items: this.createItems()})

    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({item: this.selectListView})
    }
    this.panel.show()

    this.selectListView.focus()
  }
  createItems() {
    return this.tabControllers.map((tabController, i) => {
      const activeItem = tabController.panes[0].getActiveItem()
      const primaryTitle = `${i + 1} ${activeItem ? activeItem.getTitle() : 'No name'}`
      const paneItems = tabController.panes.map((pane) => pane.getItems())
      const secondaryTitles = _.flatten(paneItems).map((item) => item.getTitle())
      return { primaryTitle, secondaryTitles, index: i }
    })
  }

  onDidTabListConfirmed(callback) {
    this.emitter.on('did-tab-list-confirmed', callback)
  }
}
