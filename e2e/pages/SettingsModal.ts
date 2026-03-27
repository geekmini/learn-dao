import type { Locator, Page } from '@playwright/test'

export class SettingsModal {
  readonly page: Page
  readonly overlay: Locator
  readonly container: Locator
  readonly apiKeyInput: Locator
  readonly modelSelect: Locator
  readonly saveButton: Locator
  readonly closeButton: Locator

  constructor(page: Page) {
    this.page = page
    this.overlay = page.locator('.modal-overlay')
    this.container = page.locator('.settings-container')
    this.apiKeyInput = page.locator('.settings-input[type="password"]')
    this.modelSelect = page.locator('.settings-select')
    this.saveButton = page.locator('.settings-save-btn')
    this.closeButton = page.locator('.settings-container .modal-close-btn')
  }

  async fillApiKey(key: string) {
    await this.apiKeyInput.fill(key)
  }

  async selectModel(modelId: string) {
    await this.modelSelect.selectOption(modelId)
  }

  async save() {
    await this.saveButton.click()
  }

  async close() {
    await this.closeButton.click()
  }
}
