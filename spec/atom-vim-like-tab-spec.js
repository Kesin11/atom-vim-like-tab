'use babel'

import AtomVimLikeTab from '../lib/atom-vim-like-tab'
import TabController from '../lib/tab_controller'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

// TODO:
// done 起動したときにtabControllersができている
// done deactivateしたときにちゃんと色々開放されている
// new tabしたときに新しいtabControllerができて別のpaneを持っている
// paneを追加したとき、activeなtabContollerに追加されていて、diactivateには追加されないこと
// nextしたときにした時に今のtabがhideでdiactivate, 前のtabがshowでactivateなこと
// paneが完全になくなったとき、tabControllerが消えていること

describe('AtomVimLikeTab', () => {
  const getMain = () => atom.packages.getLoadedPackage('atom-vim-like-tab').mainModule
  let workspaceElement
  let activationPromise

  describe('activation', () => {
    beforeEach(() => {
      // workspaceElement = atom.views.getView(atom.workspace)
      waitsForPromise(() => atom.packages.activatePackage('atom-vim-like-tab'))
    })

    describe('when activated', () => {
      it('has one tabContoller', () => {
        expect(getMain().tabControllers).toHaveLength(1)
        expect(getMain().tabControllers[0] instanceof TabController).toBe(true)
      })
    })
    describe('when deactivated', () => {
      beforeEach(() => {
        atom.packages.deactivatePackage('atom-vim-like-tab')
      })
      it('subscriptions should be disposed', () => {
        expect(getMain().subscriptions.disposed).toBe(true)
      })
      it('tabControllers should be empty', () => {
        expect(getMain().tabControllers.length).toEqual(0)
      })
    })
  })
})
