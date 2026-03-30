import { test, expect } from '@playwright/test'
import { CurriculumPage } from '../pages/CurriculumPage'
import { ChatModal } from '../pages/ChatModal'
import { mockAuthenticatedUser } from '../helpers/mockAuth'

test.describe('Feature: AI 学习助手对话', () => {
  let curriculum: CurriculumPage
  let chat: ChatModal

  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page)
    curriculum = new CurriculumPage(page)
    chat = new ChatModal(page)
    await curriculum.goto()
  })

  test.describe('Scenario: 用户打开某周卡片的 AI 对话', () => {
    test('should open chat modal when clicking chat button on week card', async ({
      page,
    }) => {
      await page.route('/api/chat', async (route) => {
        await route.fulfill({ status: 200, contentType: 'text/plain', body: '' })
      })

      await curriculum.getChatButton(0).click()

      await expect(chat.container).toBeVisible()
      await expect(chat.title).toHaveText('AI 学习助手')
      await expect(chat.subtitle).toContainText('第 1 周')
      await expect(chat.subtitle).toContainText('道的生化论与人的位置')
    })

    test('should auto-suggest topics on first open', async ({ page }) => {
      await page.route('/api/chat', async (route) => {
        await route.fulfill({ status: 200, contentType: 'text/plain', body: '' })
      })

      await curriculum.getChatButton(0).click()

      await expect(chat.getUserMessages().first()).toBeVisible()
      await expect(
        chat.getUserMessages().first().locator('.modal-message-content'),
      ).toContainText('道的生化论与人的位置')
    })

    test('should show different card context for different weeks', async ({
      page,
    }) => {
      await page.route('/api/chat', async (route) => {
        await route.fulfill({ status: 200, contentType: 'text/plain', body: '' })
      })

      await curriculum.getChatButton(1).click()

      await expect(chat.subtitle).toContainText('第 2 周')
      await expect(chat.subtitle).toContainText('受箓的意义与道士身份')
    })
  })

  test.describe('Scenario: 用户在对话框中输入问题', () => {
    test('should have input field with correct placeholder', async ({ page }) => {
      await page.route('/api/chat', async (route) => {
        await route.fulfill({ status: 200, contentType: 'text/plain', body: '' })
      })

      await curriculum.getChatButton(0).click()

      await expect(chat.input).toHaveAttribute('placeholder', '输入你的问题...')
    })

    test('should disable send button when input is empty', async ({ page }) => {
      await page.route('/api/chat', async (route) => {
        await route.fulfill({ status: 200, contentType: 'text/plain', body: '' })
      })

      await curriculum.getChatButton(0).click()

      await expect(chat.getUserMessages().first()).toBeVisible()
      await expect(chat.sendButton).toBeDisabled()
    })

    test('should enable send button when input has text', async ({ page }) => {
      await page.route('/api/chat', async (route) => {
        await route.fulfill({ status: 200, contentType: 'text/plain', body: '' })
      })

      await curriculum.getChatButton(0).click()
      await chat.input.fill('什么是道？')

      await expect(chat.sendButton).toBeEnabled()
    })
  })

  test.describe('Scenario: 用户发送消息（mock API）', () => {
    test('should display user message after sending', async ({ page }) => {
      await page.route('/api/chat', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/plain',
          body: '',
        })
      })

      await curriculum.getChatButton(0).click()
      await expect(chat.getUserMessages().first()).toBeVisible()

      await chat.input.fill('什么是道？')
      await chat.sendButton.click()

      await expect(chat.getUserMessages().nth(1)).toBeVisible()
      await expect(
        chat.getUserMessages().nth(1).locator('.modal-message-content'),
      ).toHaveText('什么是道？')
    })
  })

  test.describe('Scenario: 用户关闭对话框', () => {
    test('should close chat modal when clicking close button', async ({ page }) => {
      await page.route('/api/chat', async (route) => {
        await route.fulfill({ status: 200, contentType: 'text/plain', body: '' })
      })

      await curriculum.getChatButton(0).click()
      await expect(chat.container).toBeVisible()

      await chat.close()
      await expect(chat.container).not.toBeVisible()
    })

    test('should close chat modal when clicking overlay', async ({ page }) => {
      await page.route('/api/chat', async (route) => {
        await route.fulfill({ status: 200, contentType: 'text/plain', body: '' })
      })

      await curriculum.getChatButton(0).click()
      await expect(chat.container).toBeVisible()

      await chat.overlay.click({ position: { x: 10, y: 10 } })
      await expect(chat.container).not.toBeVisible()
    })
  })

  test.describe('Scenario: 用户清空对话记录', () => {
    test('should clear messages and show empty state after clearing', async ({
      page,
    }) => {
      await page.route('/api/chat', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/plain',
          body: '',
        })
      })

      await curriculum.getChatButton(0).click()
      await chat.input.fill('测试消息')
      await chat.sendButton.click()

      await expect(chat.getUserMessages().first()).toBeVisible()

      await chat.clear()
      await expect(chat.emptyState).toBeVisible()
    })
  })
})
