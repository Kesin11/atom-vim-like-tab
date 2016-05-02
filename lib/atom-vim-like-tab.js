'use babel';

import AtomVimLikeTabView from './atom-vim-like-tab-view';
import { CompositeDisposable } from 'atom';

export default {

  atomVimLikeTabView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomVimLikeTabView = new AtomVimLikeTabView(state.atomVimLikeTabViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomVimLikeTabView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-vim-like-tab:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomVimLikeTabView.destroy();
  },

  serialize() {
    return {
      atomVimLikeTabViewState: this.atomVimLikeTabView.serialize()
    };
  },

  toggle() {
    console.log('AtomVimLikeTab was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
