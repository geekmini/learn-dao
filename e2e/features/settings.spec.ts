import { test, expect } from '@playwright/test'
import { CurriculumPage } from '../pages/CurriculumPage'
import { SettingsModal } from '../pages/SettingsModal'

test.describe('Feature: API 设置管理', () => {
  let curriculum: CurriculumPage
  let settings: SettingsModal

  test.beforeEach(async ({ page }) => {
    curriculum = new CurriculumPage(page)
    settings = new SettingsModal(page)
    await curriculum.goto()
  })

  test.describe('Scenario: 用户首次使用，未配置 API Key', () => {
    test('should show alert dot on settings button when not configured', async () => {
      await expect(
        curriculum.settingsButton.locator('.settings-btn-alert'),
      ).toBeVisible()
    })

    test('should open settings modal when clicking settings button', async () => {
      await curriculum.settingsButton.click()
      await expect(settings.container).toBeVisible()
      await expect(settings.apiKeyInput).toBeVisible()
      await expect(settings.modelSelect).toBeVisible()
    })

    test('should redirect to settings when clicking chat without API key', async () => {
      await curriculum.getChatButton(0).click()
      await expect(settings.container).toBeVisible()
    })
  })

  test.describe('Scenario: 用户配置 API Key 和模型', () => {
    test('should save API key and close modal', async () => {
      await curriculum.settingsButton.click()
      await settings.fillApiKey('sk-ant-test-key')
      await settings.save()

      await expect(settings.container).not.toBeVisible()
    })

    test('should hide alert dot after saving API key', async () => {
      await curriculum.settingsButton.click()
      await settings.fillApiKey('sk-ant-test-key')
      await settings.save()

      await expect(
        curriculum.settingsButton.locator('.settings-btn-alert'),
      ).not.toBeVisible()
    })

    test('should allow selecting different models', async () => {
      await curriculum.settingsButton.click()
      await settings.selectModel('claude-opus-4-6')
      await expect(settings.modelSelect).toHaveValue(
        'claude-opus-4-6',
      )
    })

    test('should persist settings after page reload', async ({ page }) => {
      await curriculum.settingsButton.click()
      await settings.fillApiKey('sk-ant-persist-test')
      await settings.save()

      await page.reload()
      curriculum = new CurriculumPage(page)

      await expect(
        curriculum.settingsButton.locator('.settings-btn-alert'),
      ).not.toBeVisible()
    })
  })

  test.describe('Scenario: 用户关闭设置弹窗', () => {
    test('should close modal when clicking close button', async () => {
      await curriculum.settingsButton.click()
      await expect(settings.container).toBeVisible()

      await settings.close()
      await expect(settings.container).not.toBeVisible()
    })

    test('should close modal when clicking overlay', async () => {
      await curriculum.settingsButton.click()
      await expect(settings.container).toBeVisible()

      await settings.overlay.click({ position: { x: 10, y: 10 } })
      await expect(settings.container).not.toBeVisible()
    })
  })
})
