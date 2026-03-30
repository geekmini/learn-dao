import { test, expect } from '@playwright/test'
import { CurriculumPage } from '../pages/CurriculumPage'
import { mockSupabaseRequests } from '../helpers/mockSupabase'

test.describe('Feature: 课程大纲展示', () => {
  let curriculum: CurriculumPage

  test.beforeEach(async ({ page }) => {
    await mockSupabaseRequests(page)
    curriculum = new CurriculumPage(page)
    await curriculum.goto()
  })

  test.describe('Scenario: 用户访问首页查看修行计划', () => {
    test('should display the header with title and subtitle', async () => {
      await expect(curriculum.headerTitle).toHaveText('三个月修行计划')
      await expect(curriculum.header.locator('.header-eyebrow')).toHaveText(
        '正一派学习路线',
      )
    })

    test('should display the three pillars', async () => {
      await expect(curriculum.spine).toBeVisible()
      const cells = curriculum.spine.locator('.spine-cell')
      await expect(cells).toHaveCount(3)
      await expect(cells.nth(0).locator('strong')).toHaveText('实修优先')
      await expect(cells.nth(1).locator('strong')).toHaveText('义理为地图')
      await expect(cells.nth(2).locator('strong')).toHaveText('道为主佛为辅')
    })
  })

  test.describe('Scenario: 用户查看三个阶段的课程内容', () => {
    test('should display all three phases', async () => {
      await expect(curriculum.phaseBlocks).toHaveCount(3)
    })

    test('should display phase 1 with correct title and 3 week cards', async () => {
      const phase1 = curriculum.getPhaseBlock(0)
      await expect(phase1.locator('.phase-badge')).toHaveText('第一阶段')
      await expect(phase1.locator('.phase-title')).toHaveText(
        '立身知命 · 第 1—4 周',
      )
      await expect(phase1.locator('.week-card')).toHaveCount(3)
    })

    test('should display phase 2 with insight box', async () => {
      const phase2 = curriculum.getPhaseBlock(1)
      await expect(phase2.locator('.phase-badge')).toHaveText('第二阶段')
      await expect(phase2.locator('.insight')).toBeVisible()
    })

    test('should display phase 3 with milestone', async () => {
      const phase3 = curriculum.getPhaseBlock(2)
      await expect(phase3.locator('.phase-badge')).toHaveText('第三阶段')
      await expect(phase3.locator('.milestone')).toBeVisible()
    })
  })

  test.describe('Scenario: 用户查看每周卡片的学习要点', () => {
    test('should display 9 week cards total across all phases', async () => {
      await expect(curriculum.weekCards).toHaveCount(9)
    })

    test('should show week label, focus, and items on each card', async () => {
      const firstCard = curriculum.getWeekCard(0)
      await expect(firstCard.locator('.week-label')).toHaveText('第 1 周')
      await expect(firstCard.locator('.week-focus')).toHaveText(
        '道的生化论与人的位置',
      )
      await expect(firstCard.locator('.week-items')).toBeVisible()
    })

    test('should show a chat button on each week card', async () => {
      for (let i = 0; i < 9; i++) {
        await expect(curriculum.getChatButton(i)).toBeVisible()
      }
    })
  })

  test.describe('Scenario: 用户查看底部根本问题', () => {
    test('should display 4 fundamental questions', async () => {
      await expect(curriculum.footerQuestions).toHaveCount(4)
    })

    test('should display the footer note', async () => {
      await expect(curriculum.footerBlock.locator('.footer-note')).toContainText(
        '师父的印证',
      )
    })
  })
})
