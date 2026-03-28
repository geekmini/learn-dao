export interface WeekCard {
  id: string
  label: string
  focus: string
  items: string[]
}

export interface PracticeBox {
  title: string
  body: string[]
}

export interface Phase {
  id: string
  badge: string
  title: string
  subtitle: string
  colorClass: string
  insight?: string
  weeks: WeekCard[]
  boxes: PracticeBox[]
  milestone: string
}

export interface SpinePillar {
  title: string
  body: string
}

export interface Curriculum {
  headerEyebrow: string
  headerTitle: string
  headerSub: string[]
  pillars: SpinePillar[]
  phases: Phase[]
  footerTitle: string
  footerQuestions: string[]
  footerNote: string
}

export const curriculum: Curriculum = {
  headerEyebrow: '正一派学习路线',
  headerTitle: '三个月修行计划',
  headerSub: [
    '由立身知命，经法脉深入，至融通证道',
  ],
  pillars: [
    {
      title: '实修优先',
      body: '每日功课不断，以身体觉受验证义理。',
    },
    {
      title: '义理为地图',
      body: '读经不为博学，为照见自己在哪里。',
    },
    {
      title: '道为主佛为辅',
      body: '道学为核心，佛学为参考，融汇贯通。',
    },
  ],
  phases: [
    {
      id: 'phase-1',
      badge: '第一阶段',
      title: '立身知命 · 第 1—4 周',
      subtitle:
        '建立正确知见，落实日常功课。',
      colorClass: 'p1',
      insight:
        '修行从日常开始：每一次叩拜、每一遍功课经，都是在用身体记住这条路的方向。',
      weeks: [
        {
          id: 'week-1',
          label: '第 1 周',
          focus: '道的生化论与人的位置',
          items: [
            '道→德→气→万物的流程',
            '人是气化中的特殊存在',
            '魂魄精气神的构成',
            '「形神兼备」vs 佛教无我',
          ],
        },
        {
          id: 'week-2',
          label: '第 2 周',
          focus: '受箓的意义与道士身份',
          items: [
            '箓是什么：法位的确立',
            '与神明建立契约关系',
            '老君五戒·十戒的净化逻辑',
            '戒律 vs 佛戒：结构比较',
          ],
        },
        {
          id: 'week-3-4',
          label: '第 3—4 周',
          focus: '日课建立与经文入门',
          items: [
            '早晚坛功课经逐句解义',
            '焚香叩拜的仪轨根据',
            '《道德经》通读',
            '修行日记：记觉受与疑问',
          ],
        },
      ],
      boxes: [
        {
          title: '每日实修',
          body: [
            '师父规定的早晚课（不间断）',
            '读《道德经》一章，静思五分钟',
            '睡前记录：今日觉受 / 疑问',
          ],
        },
        {
          title: '本阶段的核心问题',
          body: [
            '「道生一，一生二，二生三，三生万物」——这个「生」，跟缘起的「起」，是同一件事吗？先不急着回答，带着它修。',
          ],
        },
      ],
      milestone:
        '阶段目标：每日功课已成自然习惯；能清楚说出受箓对自己意味着什么；《道德经》通读完毕',
    },
    {
      id: 'phase-2',
      badge: '第二阶段',
      title: '法脉深入 · 第 5—9 周',
      subtitle:
        '深入正一法术体系，知其然更知其所以然。',
      colorClass: 'p2',
      insight:
        '修行者读法的方式：学符箓时问「这道符在宇宙论里代表什么」；学斋醮时问「这个仪式结构如何净化身心」；学存思时问「我在观想什么，观想者是谁」。',
      weeks: [
        {
          id: 'week-5-6',
          label: '第 5—6 周',
          focus: '符箓的神学本体论',
          items: [
            '符为天书：先天文字观',
            '符箓的宇宙论根据',
            '三天法箓体系与法位',
            '书符前的身心净化要求',
            '咒与符的配合逻辑',
          ],
        },
        {
          id: 'week-7-8',
          label: '第 7—8 周',
          focus: '斋醮的内外结构',
          items: [
            '斋（内）：身心清净的准备',
            '醮（外）：沟通神灵的仪式',
            '疏文表文：意志的正式呈递',
            '济度亡灵 = 净化自身业力',
            '仪式如何重塑参与者的心',
          ],
        },
        {
          id: 'week-9',
          label: '第 9 周',
          focus: '存思法：内观的正一路径',
          items: [
            '存思：观想体内神明',
            '守一·守玄的原理',
            '《黄庭内景经》的修行地图',
            '与佛教止观的结构对比',
            '「观想者是谁」——关键问题',
          ],
        },
      ],
      boxes: [
        {
          title: '实修重点',
          body: [
            '跟师父学习书符写咒',
            '参与或完整观摩一次斋醮仪式',
            '开始存思练习，记录每次觉受',
            '仪式后静坐：身心有何变化？',
          ],
        },
        {
          title: '精读经典',
          body: [
            '《太上洞玄灵宝无量度人经》',
            '《黄庭内景经》（存思章节）',
            '《正一法文》相关章节',
            '——读时问：这在说我的哪个层次？',
          ],
        },
      ],
      milestone:
        '阶段目标：能解释符箓斋醮的神学逻辑而非仅知步骤；存思练习有初步身体觉受；完成一次完整仪式的参与',
    },
    {
      id: 'phase-3',
      badge: '第三阶段',
      title: '融通证道 · 第 10—12 周',
      subtitle:
        '贯通正一义理与修行，为长期修道确立方向。',
      colorClass: 'p3',
      insight:
        '这一阶段的核心转变：从「学习正一是什么」转向「正一在我身上如何运作」。知见开始内化为修行的眼睛，而不只是储存在脑袋里的知识。',
      weeks: [
        {
          id: 'week-10',
          label: '第 10 周',
          focus: '正一的解脱论',
          items: [
            '尸解·飞升·归道的层次',
            '魂神得度的具体机制',
            '积功累德在解脱中的位置',
            '度人（济世）与自度的关系',
            '「仍在道的流化中」意味着什么',
          ],
        },
        {
          id: 'week-11',
          label: '第 11 周',
          focus: '佛道义理的深度对话',
          items: [
            '真空妙有 vs 无中生有',
            '涅槃（寂灭）vs 归道（复归）',
            '道体 vs 佛性 vs 如来藏',
            '「天青之后」：两家的不同选择',
            '这个差异在你修行中如何呈现？',
          ],
        },
        {
          id: 'week-12',
          label: '第 12 周',
          focus: '建立长期修行方向',
          items: [
            '与师父深谈：进阶方向确认',
            '制定个人长期修行计划',
            '确立常诵经典清单',
            '写下此刻最核心的疑问',
            '——带着它继续走',
          ],
        },
      ],
      boxes: [
        {
          title: '第 12 周的功课',
          body: [
            '深度精读《度人经》并作义理笔记',
            '写一篇「我理解的归根复命」',
            '与师父做一次深谈，印证三个月的修行',
          ],
        },
        {
          title: '一个不能回避的问题',
          body: [
            '「本体在概念之前，在语言之前，在我之前」——佛道两家在这里同时沉默。你的实修在这个沉默里，感受到的是寂灭还是归家？这不是义理题，是修行题。',
          ],
        },
      ],
      milestone:
        '阶段目标：能清晰表达正一解脱论；对佛道差异有成熟的自身观察；长期修行路线经师父确认',
    },
  ],
  footerTitle: '贯穿三个月的根本问题（不急着答，带着它修）',
  footerQuestions: [
    '· 「道」作为本体，是否有自性？',
    '· 存思时「观想者」是谁？',
    '· 仪式净化的，是什么层次的「我」？',
    '· 归道之后，还有「回家的人」吗？',
  ],
  footerNote:
    '这四个问题，书本给不了答案。师父的印证 + 实修的觉受，才是真正的回答。',
}

export function buildSystemPrompt(focusCardId: string): string {
  const fullContext = curriculum.phases
    .map((phase) => {
      const weeksSummary = phase.weeks
        .map((w) => `${w.label}「${w.focus}」: ${w.items.join('；')}`)
        .join('\n')
      return `【${phase.title}】\n${phase.subtitle}\n${weeksSummary}`
    })
    .join('\n\n')

  const focusCard = curriculum.phases
    .flatMap((p) => p.weeks)
    .find((w) => w.id === focusCardId)

  const focusContext = focusCard
    ? `\n\n【当前聚焦】${focusCard.label}「${focusCard.focus}」\n学习要点：\n${focusCard.items.map((i) => `- ${i}`).join('\n')}`
    : ''

  return `你是一位正一派道教的资深修行导师，精通正一派义理、法术、斋醮科仪、符箓、存思等修行体系。

以下是完整的三个月修行课程大纲：

${fullContext}
${focusContext}

请基于当前聚焦的学习内容，用中文回答修行者的问题。回答要：
1. 以修行者的视角而非学术研究的视角
2. 结合实修经验给出具体指导
3. 在适当时候引用经典原文
4. 排版时不要使用 --- 水平分隔线，用标题或空行来组织内容`
}
