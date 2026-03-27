import type { Locator, Page } from '@playwright/test'

export class ChatModal {
  readonly page: Page
  readonly overlay: Locator
  readonly container: Locator
  readonly title: Locator
  readonly subtitle: Locator
  readonly messages: Locator
  readonly emptyState: Locator
  readonly input: Locator
  readonly sendButton: Locator
  readonly clearButton: Locator
  readonly closeButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.overlay = page.locator('.modal-overlay')
    this.container = page.locator('.modal-container')
    this.title = page.locator('.modal-title')
    this.subtitle = page.locator('.modal-subtitle')
    this.messages = page.locator('.modal-message')
    this.emptyState = page.locator('.modal-empty')
    this.input = page.locator('.modal-input')
    this.sendButton = page.locator('.modal-send-btn')
    this.clearButton = page.locator('.modal-clear-btn')
    this.closeButton = page.locator('.modal-container .modal-close-btn')
    this.errorMessage = page.locator('.modal-error')
  }

  async sendMessage(text: string) {
    await this.input.fill(text)
    await this.sendButton.click()
  }

  async close() {
    await this.closeButton.click()
  }

  async clear() {
    await this.clearButton.click()
  }

  getUserMessages() {
    return this.page.locator('.modal-message-user')
  }

  getAssistantMessages() {
    return this.page.locator('.modal-message-assistant')
  }
}
