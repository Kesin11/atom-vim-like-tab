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

        const oldController = getFirstTabController()
        expect(
          _.all(oldController.getPaneViews(),
          (view) => view.style.display === 'none')
        ).toBe(true)
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
      it('current tab should be hide', () => {
        const beforeShowIndex = getMain().showIndex
        dispatchCommand('atom-vim-like-tab:next')

        const previousController = getTabControllers()[beforeShowIndex].panes
        expect(
          _.all(previousController.getPaneViews,
            (view) => view.style.display === 'none')
          ).toBe(true)
      })
      it('next tab should be show', () => {
        dispatchCommand('atom-vim-like-tab:next')
        const showIndex = getMain().showIndex

        const nextController = getTabControllers()[showIndex]
        expect(_.all(nextController.getPaneViews, (view) => view.style.display === '')).toBe(true)
      })
    })

    describe('close-tab', () => {
      beforeEach(() => {
        dispatchCommand('atom-vim-like-tab:new-tab')
      })
      it('current TabController should be removed', () => {
        const currentController = getLastTabController()
        dispatchCommand('atom-vim-like-tab:close-tab')

        expect(currentController.panes.length).toEqual(0)
        expect(getTabControllers()).not.toContain(currentController)
      })
      it('previous panes should be show', () => {
        dispatchCommand('atom-vim-like-tab:close-tab')
        const showIndex = getMain().showIndex

        const nextController = getTabControllers()[showIndex]
        expect(_.all(nextController.getPaneViews, (view) => view.style.display === '')).toBe(true)
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
