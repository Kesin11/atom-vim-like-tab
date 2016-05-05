'use babel'

import {
  getMain,
  getTabControllers,
  getFirstTabController,
  getLastTabController,
  dispatchCommand,
} from './spec-helper.js'
import TabController from '../lib/tab_controller'
import _ from 'underscore-plus'

describe('AtomVimLikeTab', () => {
  describe('activation', () => {
    beforeEach(() => {
      waitsForPromise(() => atom.packages.activatePackage('atom-vim-like-tab'))
    })

    describe('when activated', () => {
      it('has one tabContoller', () => {
        expect(getTabControllers()).toHaveLength(1)
        expect(getTabControllers()[0] instanceof TabController).toBe(true)
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
        expect(getTabControllers().length).toEqual(0)
      })
    })
  })

  describe('dispatch command', () => {
    beforeEach(() => {
      waitsForPromise(() => atom.packages.activatePackage('atom-vim-like-tab'))
    })
    afterEach(() => {
      atom.packages.deactivatePackage('atom-vim-like-tab')
    })

    describe('new-tab', () => {
      it('tabControllers should be have new controller', () => {
        const beforeControllersNum = getTabControllers().length
        dispatchCommand('atom-vim-like-tab:new-tab')

        expect(getTabControllers().length).toBeGreaterThan(beforeControllersNum)
      })
      it('old pane should be hide', () => {
        dispatchCommand('atom-vim-like-tab:new-tab')

        const oldControllerPanes = getFirstTabController().panes
        const oldControllerPaneViews =
          oldControllerPanes.map((pane) => atom.views.getView(pane))
        expect(_.all(oldControllerPaneViews, (view) => view.style.display === 'none')).toBe(true)
      })
      it('new tabControllers should be have another pane', () => {
        const beforePanes = getFirstTabController().panes
        dispatchCommand('atom-vim-like-tab:new-tab')

        const newPane = _.first(getLastTabController().panes)
        expect(beforePanes).not.toContain(newPane)
      })
      it('new pane should be managed new tabContoller after new-tab command', () => {
        dispatchCommand('atom-vim-like-tab:new-tab')
        atom.workspace.getActivePane().splitRight()
        const newPane = atom.workspace.getActivePane()

        const oldControllerPanes = getFirstTabController().panes
        const newControllerPanes = getLastTabController().panes
        expect(oldControllerPanes).not.toContain(newPane)
        expect(newControllerPanes).toContain(newPane)
      })
    })

    describe('next', () => {
      beforeEach(() => {
        dispatchCommand('atom-vim-like-tab:new-tab')
      })
      it('next pane should be show', () => {
        dispatchCommand('atom-vim-like-tab:next')
        const showIndex = getMain().showIndex

        const nextControllerPanes = getTabControllers()[showIndex].panes
        const nextControllerPaneViews =
          nextControllerPanes.map((pane) => atom.views.getView(pane))
        expect(_.all(nextControllerPaneViews, (view) => view.style.display === '')).toBe(true)
      })
      it('previous pane should be hide', () => {
        const beforeShowIndex = getMain().showIndex
        dispatchCommand('atom-vim-like-tab:next')

        const previousControllerPanes = getTabControllers()[beforeShowIndex].panes
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
        waitsForPromise(() => atom.packages.activatePackage('atom-vim-like-tab'))
      })
      afterEach(() => {
        atom.packages.deactivatePackage('atom-vim-like-tab')
      })
      describe('when all panes are closed', () => {
        it('unnecessary tabController should be removed', () => {
          // create new tab and then close all pane
          dispatchCommand('atom-vim-like-tab:new-tab')
          const newController = getLastTabController()
          newController.panes.forEach((pane) => pane.close())

          expect(getTabControllers()).not.toContain(newController)
        })
      })
    })
  })
})
