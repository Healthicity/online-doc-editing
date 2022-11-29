'use strict'

const STATES = {
  EDITING: ['Waiting', 'In-progress'],
  REVIEW: ['Review needed'],
  APPROVAL: ['For approval'],
  SIGNED: ['Approved'],
  REJECTED: ['Rejected'],
  REMOVED: ['Removed']
}

module.exports = (req, res, next) => {
  const { documentState } = req.query

  switch (documentState) {
    case 'review':
      res.locals.statesToFind = STATES.REVIEW
      break
    case 'editing':
      res.locals.statesToFind = STATES.EDITING
      break
    case 'approval':
      res.locals.statesToFind = STATES.APPROVAL
      break
    case 'signed':
      res.locals.statesToFind = STATES.SIGNED
      break
    case 'rejected':
      res.locals.statesToFind = STATES.REJECTED
      break
    case 'removed':
      res.locals.statesToFind = STATES.REMOVED
      break
    default:
      res.locals.statesToFind = STATES.EDITING
  }

  return next()
}
