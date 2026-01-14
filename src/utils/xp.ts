// @/utils/xp.ts

import { updateUserXP } from "@/store/apis/lessonsApi/helpers"


export const XP_RULES = {
  COMPLETE_LESSON: (lessonXP: number) => lessonXP,
  COMPLETE_ITEM: (lessonXP: number, totalItems: number) =>
    Math.floor(lessonXP / totalItems),
  PASS_TEST: 50,
  DAILY_STREAK: 10
}


export function calculateXP(event: {
  type: 'COMPLETE_LESSON' | 'COMPLETE_ITEM'
  lessonXP?: number
  totalItems?: number
}) {
  switch (event.type) {
    case 'COMPLETE_LESSON':
      return event.lessonXP ?? 0

    case 'COMPLETE_ITEM':
      if (!event.lessonXP || !event.totalItems) return 0
      return Math.floor(event.lessonXP / event.totalItems)

    default:
      return 0
  }
}



export async function grantXP(
  userId: string,
  xp: number,
  reason: string
) {
  if (xp <= 0) return

  // تحديث XP
  await updateUserXP(userId, xp)

}
