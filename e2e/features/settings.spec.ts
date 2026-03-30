import { test, expect } from '@playwright/test'
import { CurriculumPage } from '../pages/CurriculumPage'
import { SettingsModal } from '../pages/SettingsModal'
import { mockAuthenticatedUser } from '../helpers/mockAuth'

test.describe('Feature: API 设置管理', () => {
  let curriculum: CurriculumPage
  let settings: SettingsModal

  test.describe('Scenario: 未登录用户点击聊天按钮', () => {
    test.beforeEach(async ({ page }) => {
      curriculum = new CurriculumPage(page)
      await curriculum.goto()
    })

    test('should show login button in header when not logged in', async () => {
      await expect(curriculum.loginButton).toBeVisible()
    })

    test('should show login prompt when clicking chat without login', async () => {
      await curriculum.getChatButton(0).click()
      await expect(curriculum.loginPromptModal).toBeVisible()
    })
  })

  test.describe('Scenario: 已登录用户管理设置', () => {
    test.beforeEach(async ({ page }) => {
      await mockAuthenticatedUser(page)
      curriculum = new CurriculumPage(page)
      settings = new SettingsModal(page)
      await curriculum.goto()
    })

    test('should show user avatar in header when logged in', async () => {
      await expect(curriculum.userMenuButton).toBeVisible()
    })

    test('should open settings modal from user menu', async () => {
      await curriculum.openSettingsViaMenu()
      await expect(settings.container).toBeVisible()
      await expect(settings.apiKeyInput).toBeVisible()
      await expect(settings.modelSelect).toBeVisible()
    })

    test('should save API key and close modal', async () => {
      await curriculum.openSettingsViaMenu()
      await settings.fillApiKey('sk-ant-test-key')
      await settings.save()
      await expect(settings.container).not.toBeVisible()
    })

    test('should allow selecting different models', async () => {
      await curriculum.openSettingsViaMenu()
      await settings.selectModel('claude-opus-4-6')
      await expect(settings.modelSelect).toHaveValue('claude-opus-4-6')
    })

    test('should close modal when clicking close button', async () => {
      await curriculum.openSettingsViaMenu()
      await expect(settings.container).toBeVisible()
      await settings.close()
      await expect(settings.container).not.toBeVisible()
    })

    test('should close modal when clicking overlay', async () => {
      await curriculum.openSettingsViaMenu()
      await expect(settings.container).toBeVisible()
      await settings.overlay.click({ position: { x: 10, y: 10 } })
      await expect(settings.container).not.toBeVisible()
    })
  })
})
