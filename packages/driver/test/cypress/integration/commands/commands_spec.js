// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  _,
} = Cypress
const {
  $,
} = Cypress

describe('src/cy/commands/commands', function () {
  before(() => {
    return cy
    .visit('/fixtures/dom.html')
    .then(function (win) {
      this.body = win.document.body.outerHTML
    })
  })

  beforeEach(function () {
    const doc = cy.state('document')

    return $(doc.body).empty().html(this.body)
  })

  it('can invoke commands by name', () => {
    const body = cy.$$('body')

    return cy
    .get('body').then(($body) => expect($body.get(0)).to.eq(body.get(0))).command('get', 'body').then(($body) => expect($body.get(0)).to.eq(body.get(0)))
  })

  it('can invoke child commands by name', () => {
    const div = cy.$$('body>div:first')

    return cy
    .get('body').find('div:first').then(($div) => expect($div.get(0)).to.eq(div.get(0))).get('body').command('find', 'div:first').then(($div) => expect($div.get(0)).to.eq(div.get(0)))
  })

  it('does not add cmds to cy.commands queue', () => {
    return cy.command('get', 'body').then(() => {
      const names = cy.queue.names()

      return expect(names).to.deep.eq(['get', 'then'])
    })
  })

  context('custom commands', () => {
    beforeEach(() => {
      Cypress.Commands.add('dashboard.selectWindows', () => {
        return cy
        .get('[contenteditable]')
        .first()
      })

      return Cypress.Commands.add('login', { prevSubject: true }, (subject, email) => {
        return cy
        .wrap(subject.find('input:first'))
        .type(email)
      })
    })

    it('works with custom commands', () => {
      const input = cy.$$('input:first')

      return cy
      .get('input:first')
      .parent()
      .command('login', 'brian@foo.com').then(($input) => expect($input.get(0)).to.eq(input.get(0)))
    })

    return it('works with namespaced commands', () => {
      const ce = cy.$$('[contenteditable]').first()

      return cy
      .command('dashboard.selectWindows').then(($ce) => expect($ce.get(0)).to.eq(ce.get(0)))
    })
  })

  return context('errors', () => {
    return it('throws when cannot find command by name', (done) => {
      cy.on('fail', (err) => {
        const cmds = _.keys(Cypress.Chainer.prototype)

        expect(cmds.length).to.be.gt(1)
        expect(err.message).to.eq(`Could not find a command for: \`fooDoesNotExist\`.\n\nAvailable commands are: \`${cmds.join('`, `')}\`.\n`)
        expect(err.docsUrl).to.eq('https://on.cypress.io/api')

        return done()
      })

      return cy.get('body').command('fooDoesNotExist', 'bar', 'baz')
    })
  })
})