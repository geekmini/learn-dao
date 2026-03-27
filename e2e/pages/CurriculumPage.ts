import type { Locator, Page } from '@playwright/test'

export class CurriculumPage {
  readonly page: Page
  readonly header: Locator
  readonly headerTitle: Locator
  readonly settingsButton: Locator
  readonly spine: Locator
  readonly phaseBlocks: Locator
  readonly weekCards: Locator
  readonly footerBlock: Locator
  readonly footerQuestions: Locator

  constructor(page: Page) {
    this.page = page
    this.header = page.locator('.header')
    this.headerTitle = page.locator('.header h1')
    this.settingsButton = page.locator('.settings-btn')
    this.spine = page.locator('.spine')
    this.phaseBlocks = page.locator('.phase-block')
    this.weekCards = page.locator('.week-card')
    this.footerBlock = page.locator('.footer-block')
    this.footerQuestions = page.locator('.q-item')
  }

  async goto() {
    await this.page.goto('/')
  }

  getPhaseBlock(index: number) {
    return this.phaseBlocks.nth(index)
  }

  getWeekCard(index: number) {
    return this.weekCards.nth(index)
  }

  getChatButton(weekCardIndex: number) {
    return this.weekCards.nth(weekCardIndex).locator('.chat-btn')
  }

  getChatHistoryDot(weekCardIndex: number) {
    return this.weekCards.nth(weekCardIndex).locator('.chat-btn-dot')
  }
}
