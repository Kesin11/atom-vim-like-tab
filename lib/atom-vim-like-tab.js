'use babel'

import { CompositeDisposable } from 'atom'

export default {

  subscriptions: null,

  activate(state) {
    console.log('Activate')
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-vim-like-tab:toggle': () => this.toggle(),
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  toggle() {
    console.log('AtomVimLikeTab was toggled!')
  },

}
