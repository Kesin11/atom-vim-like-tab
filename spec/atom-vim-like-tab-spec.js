'use babel'

import TabController from '../lib/tab_controller'
import _ from 'underscore-plus'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

// TODO:
// done 起動したときにtabControllersができている
// done deactivateしたときにちゃんと色々開放されている
// done new tabしたときに新しいtabControllerができて別のpaneを持っている
// done paneを追加したとき、activeなtabContollerに追加されていて、deiactivateには追加されないこと
// done nextしたときにした時に今のtabがhideでdeactivate, 前のtabがshowでactivateなこと
// done paneが完全になくなったとき、tabControllerが消えていること

describe('AtomVimLikeTab', () => {
  const getMain = () => atom.packages.getLoadedPackage('atom-vim-like-tab').mainModule

  describe('activation', () => {
    beforeEach(() => {
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

  describe('dispatch command', () => {
    let workSpaceElement
    beforeEach(() => {
      workSpaceElement = atom.views.getView(atom.workspace)
      waitsForPromise(() => atom.packages.activatePackage('atom-vim-like-tab'))
    })
    afterEach(() => {
      atom.packages.deactivatePackage('atom-vim-like-tab')
    })

    describe('new-tab', () => {
      it('tabControllers should be have new controller', () => {
        const beforeControllersNum = getMain().tabControllers.length
        atom.commands.dispatch(workSpaceElement, 'atom-vim-like-tab:new-tab')

        const afterControlelrs = getMain().tabControllers
        expect(afterControlelrs.length).toBeGreaterThan(beforeControllersNum)
      })
      it('old pane should be hide', () => {
        atom.commands.dispatch(workSpaceElement, 'atom-vim-like-tab:new-tab')

        const oldControllerPanes = _.first(getMain().tabControllers).panes
        const oldControllerPaneViews =
          oldControllerPanes.map((pane) => atom.views.getView(pane))
        expect(_.all(oldControllerPaneViews, (view) => view.style.display === 'none')).toBe(true)
      })
      it('new tabControllers should be have another pane', () => {
        const beforePanes = _.first(getMain().tabControllers).panes
        atom.commands.dispatch(workSpaceElement, 'atom-vim-like-tab:new-tab')

        const newController = _.last(getMain().tabControllers)
        const newPane = _.first(newController.panes)
        expect(beforePanes).not.toContain(newPane)
      })
      it('new pane should be managed new tabContoller after new-tab command', () => {
        atom.commands.dispatch(workSpaceElement, 'atom-vim-like-tab:new-tab')
        atom.workspace.getActivePane().splitRight()
        const newPane = atom.workspace.getActivePane()

        const oldControllerPanes = _.first(getMain().tabControllers).panes
        const newControllerPanes = _.last(getMain().tabControllers).panes
        expect(oldControllerPanes).not.toContain(newPane)
        expect(newControllerPanes).toContain(newPane)
      })
    })

    describe('next', () => {
      beforeEach(() => {
        atom.commands.dispatch(workSpaceElement, 'atom-vim-like-tab:new-tab')
      })
      it('next pane should be show', () => {
        atom.commands.dispatch(workSpaceElement, 'atom-vim-like-tab:next')
        const showIndex = getMain().showIndex

        const nextControllerPanes = getMain().tabControllers[showIndex].panes
        const nextControllerPaneViews =
          nextControllerPanes.map((pane) => atom.views.getView(pane))
        expect(_.all(nextControllerPaneViews, (view) => view.style.display === '')).toBe(true)
      })
      it('previous pane should be hide', () => {
        const beforeShowIndex = getMain().showIndex
        atom.commands.dispatch(workSpaceElement, 'atom-vim-like-tab:next')

        const previousControllerPanes = getMain().tabControllers[beforeShowIndex].panes
        const previousControllerPaneViews =
          previousControllerPanes.map((pane) => atom.views.getView(pane))
        expect(
          _.all(previousControllerPaneViews,
            (view) => view.style.display === 'none')
          ).toBe(true)
      })
    })
    describe('triggered by outside action', () => {
      beforeEach(() => {
        workSpaceElement = atom.views.getView(atom.workspace)
        waitsForPromise(() => atom.packages.activatePackage('atom-vim-like-tab'))
      })
      afterEach(() => {
        atom.packages.deactivatePackage('atom-vim-like-tab')
      })
      describe('when all panes are closed', () => {
        it('unnecessary tabController should be removed', () => {
          atom.commands.dispatch(workSpaceElement, 'atom-vim-like-tab:new-tab')
          const newController = _.last(getMain().tabControllers)
          newController.panes.forEach((pane) => pane.close())

          expect(getMain().tabControllers).not.toContain(newController)
        })
      })
    })
  })
})
