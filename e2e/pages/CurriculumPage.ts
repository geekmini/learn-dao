import type { Locator, Page } from '@playwright/test'

export class CurriculumPage {
  readonly page: Page
  readonly header: Locator
  readonly headerTitle: Locator
  readonly loginButton: Locator
  readonly userMenuButton: Locator
  readonly userDropdown: Locator
  readonly spine: Locator
  readonly phaseBlocks: Locator
  readonly weekCards: Locator
  readonly footerBlock: Locator
  readonly footerQuestions: Locator
  readonly loginPromptModal: Locator

  constructor(page: Page) {
    this.page = page
    this.header = page.locator('.header')
    this.headerTitle = page.locator('.header h1')
    this.loginButton = page.locator('.auth-login-btn')
    this.userMenuButton = page.locator('.user-menu-btn')
    this.userDropdown = page.locator('.user-dropdown')
    this.spine = page.locator('.spine')
    this.phaseBlocks = page.locator('.phase-block')
    this.weekCards = page.locator('.week-card')
    this.footerBlock = page.locator('.footer-block')
    this.footerQuestions = page.locator('.q-item')
    this.loginPromptModal = page.locator('.login-prompt-body')
  }

  async goto() {
    await this.page.goto('/')
  }

  async openSettingsViaMenu() {
    await this.userMenuButton.click()
    await this.userDropdown.getByText('设置').click()
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
