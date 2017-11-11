'use babel'

import _ from 'underscore-plus'

export function getTabControllers(atomVimLikeTab) { return atomVimLikeTab.tabControllers() }
export function getFirstTabController(atomVimLikeTab) { return _.first(getTabControllers(atomVimLikeTab)) }
export function getLastTabController(atomVimLikeTab) { return _.last(getTabControllers(atomVimLikeTab)) }
export function dispatchCommand(command, element = atom.views.getView(atom.workspace)) {
  atom.commands.dispatch(element, command)
}
